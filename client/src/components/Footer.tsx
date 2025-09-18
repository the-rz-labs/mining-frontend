import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Twitter, Github, Linkedin, Mail, Globe, Shield, Zap } from "lucide-react";
import Logo from "./Logo";

interface FooterProps {
  onContactClick?: () => void;
  onNewsletterSignup?: (email: string) => void;
}

export default function Footer({ onContactClick, onNewsletterSignup }: FooterProps) {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    console.log("Newsletter signup:", email);
    onNewsletterSignup?.(email);
  };

  const navigationSections = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Contact", href: "#contact" },
        { name: "Careers", href: "#careers" },
        { name: "Press", href: "#press" }
      ]
    },
    {
      title: "Platform",
      links: [
        { name: "Mining Plans", href: "#plans" },
        { name: "Live Stats", href: "#stats" },
        { name: "Token Charts", href: "#tokens" },
        { name: "Referral Program", href: "#referral" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#twitter", color: "hover:text-cyber-blue" },
    { name: "GitHub", icon: Github, href: "#github", color: "hover:text-foreground" },
    { name: "LinkedIn", icon: Linkedin, href: "#linkedin", color: "hover:text-cyber-blue" },
    { name: "Email", icon: Mail, href: "#email", color: "hover:text-mining-orange" }
  ];


  return (
    <footer className="bg-gradient-to-t from-card/50 to-background border-t border-border" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <Logo />
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Our system is built on fairness and transparency. Here's what makes us different: No token deposits: We don't take your assets. You mine using your resources.
              </p>
            </div>


            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="icon"
                  data-testid={`social-${social.name.toLowerCase()}`}
                  onClick={() => {
                    console.log(`${social.name} clicked`);
                  }}
                  className={`text-muted-foreground ${social.color} transition-colors duration-300 hover-elevate`}
                >
                  <social.icon className="w-5 h-5" />
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {navigationSections.map((section, sectionIndex) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      data-testid={`footer-link-${section.title.toLowerCase()}-${linkIndex}`}
                      onClick={(e) => {
                        e.preventDefault();
                        console.log(`Footer link clicked: ${link.name}`);
                        if (link.name === "Contact") {
                          onContactClick?.();
                        }
                      }}
                      className="text-muted-foreground hover:text-neon-purple transition-colors duration-300 hover-elevate px-2 py-1 rounded-md -mx-2"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-neon-purple/10 via-mining-orange/10 to-neon-green/10 rounded-xl p-8 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Stay Updated with Mining Insights
            </h3>
            <p className="text-muted-foreground mb-6">
              Get the latest mining trends, token updates, and platform news delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                data-testid="newsletter-email-input"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-transparent"
              />
              <Button
                type="submit"
                data-testid="newsletter-subscribe-button"
                className="bg-gradient-to-r from-neon-purple to-mining-orange text-white font-semibold hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-300"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-wrap items-center space-x-6 text-sm text-muted-foreground">
            <span>© 2024 Ranking Mining Platform. All rights reserved.</span>
            <a href="#privacy" className="hover:text-neon-purple transition-colors" data-testid="privacy-link">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-neon-purple transition-colors" data-testid="terms-link">
              Terms of Service
            </a>
            <a href="#cookies" className="hover:text-neon-purple transition-colors" data-testid="cookies-link">
              Cookie Policy
            </a>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}