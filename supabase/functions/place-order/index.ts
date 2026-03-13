import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Client with user's JWT to get user identity
    const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service role client for trusted operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { items, order_type, payment_method, special_instructions } = await req.json();

    // Validate inputs
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!["pickup", "dine-in"].includes(order_type)) {
      return new Response(JSON.stringify({ error: "Invalid order type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract menu item IDs and quantities from request
    const itemMap = new Map<string, number>();
    for (const item of items) {
      if (!item.menu_item_id || typeof item.quantity !== "number" || item.quantity < 1 || item.quantity > 100) {
        return new Response(JSON.stringify({ error: "Invalid item in cart" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      itemMap.set(item.menu_item_id, item.quantity);
    }

    // Fetch real prices from database
    const menuItemIds = Array.from(itemMap.keys());
    const { data: menuItems, error: menuError } = await supabaseAdmin
      .from("menu_items")
      .select("id, price, available, name")
      .in("id", menuItemIds)
      .eq("available", true);

    if (menuError || !menuItems) {
      return new Response(JSON.stringify({ error: "Failed to fetch menu items" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify all requested items exist and are available
    if (menuItems.length !== menuItemIds.length) {
      const foundIds = new Set(menuItems.map((m) => m.id));
      const missingIds = menuItemIds.filter((id) => !foundIds.has(id));
      return new Response(
        JSON.stringify({ error: "Some items are unavailable", missing: missingIds }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Compute total server-side using real prices
    let total = 0;
    const orderItemsData = menuItems.map((menuItem) => {
      const quantity = itemMap.get(menuItem.id)!;
      total += menuItem.price * quantity;
      return {
        menu_item_id: menuItem.id,
        quantity,
        price: menuItem.price,
      };
    });

    // Insert order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user.id,
        order_type,
        payment_method: payment_method || "cash",
        special_instructions: special_instructions || null,
        total,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order insert error:", orderError);
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert order items with server-verified prices
    const orderItems = orderItemsData.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems);

    if (itemsError) {
      console.error("Order items insert error:", itemsError);
      return new Response(JSON.stringify({ error: "Failed to save order items" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, order_id: order.id, total }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
