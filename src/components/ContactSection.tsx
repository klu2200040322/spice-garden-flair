import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-secondary font-body text-sm tracking-[0.3em] uppercase mb-2">Get In Touch</p>
          <h2 className="section-title">Contact Us</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <MapPin className="text-secondary mt-1 shrink-0" size={22} />
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-1">Address</h3>
                <p className="text-muted-foreground">123 Culinary Lane, Food District<br />New York, NY 10001</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Phone className="text-secondary mt-1 shrink-0" size={22} />
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-1">Phone</h3>
                <p className="text-muted-foreground">(212) 555-0142</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Mail className="text-secondary mt-1 shrink-0" size={22} />
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-1">Email</h3>
                <p className="text-muted-foreground">hello@spicegarden.com</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Clock className="text-secondary mt-1 shrink-0" size={22} />
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-1">Opening Hours</h3>
                <p className="text-muted-foreground">
                  Mon – Fri: 11:30 AM – 10:00 PM<br />
                  Sat – Sun: 12:00 PM – 11:00 PM
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden h-[400px]">
            <iframe
              title="Spice Garden Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878428698!3d40.74076794379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629794729807!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
