import { Mail, MapPin, Phone } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact-section" className="py-20 px-4 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-center">Contact</h2>
      
      <div className="glass-card p-8 rounded-lg">
        <p className="text-center text-muted-foreground mb-6">
          Need help with a project or want to work together? Feel free to reach out to me.
        </p>
        <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <a href="mailto:v.hanert@gmail.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  v.hanert@gmail.com
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Phone</p>
                <a href="tel:+4560812114" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  +45 60812114
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  Abel Cathrines Gade 7, 1654, København V
                </p>
              </div>
            </div>
          </div>
          
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 rounded-lg bg-secondary/50"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-secondary/50"
            />
            <textarea
              placeholder="Message"
              rows={4}
              className="w-full p-3 rounded-lg bg-secondary/50"
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};