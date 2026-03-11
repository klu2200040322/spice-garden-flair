import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-background p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
