import { Link, useLocation, useNavigate } from "react-router-dom";
import { Send, Instagram, Linkedin, Youtube, Mail, MapPin, Hash } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.webp";
import { smoothScrollToId } from "@/lib/smoothScroll";

const products = [
  { label: "Разработка сайтов", href: "/products/website" },
  { label: "Telegram-боты и Mini Apps", href: "/products/telegram-bot" },
  { label: "AI-видео", href: "/products/ai-video" },
  { label: "AI-ассистент", href: "/products/ai-agent" },
];

const company = [
  { label: "О нас", href: "/about", hashId: null },
  { label: "Кейсы", href: "/portfolio", hashId: "cases" },
  { label: "Продукты", href: "/services", hashId: "services" },
  { label: "Процесс", href: "/process", hashId: "process" },
  { label: "Контакты", href: "/contacts", hashId: "contact" },
];

const socialLinks = [
  { icon: Send, href: "https://t.me/neeklo", label: "Telegram" },
  { icon: Instagram, href: "https://instagram.com/neeklo", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/neeklo", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com/@neeklo", label: "YouTube" },
];

export const Footer = () => {
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hello@neeklo.studio");
      setCopied(true);
      toast({
        title: "Email скопирован!",
        description: "hello@neeklo.studio",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const handleCompanyAnchor = (hashId: string | null) => {
    if (!hashId) return;
    if (location.pathname !== "/") {
      navigate(`/#${hashId}`);
      return;
    }
    smoothScrollToId(hashId);
  };

  return (
    <footer className="bg-background border-t border-border/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 pb-28 lg:pb-20">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          {/* Column 1: Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img
                src={logo}
                alt="Neeklo Studio"
                width={166}
                height={48}
                loading="lazy"
                decoding="async"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-base text-foreground/70 mb-6 leading-relaxed">
              Цифровая студия нового поколения
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-11 h-11 rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10 hover:scale-110 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-5">
              Продукты
            </h3>
            <ul className="space-y-3.5">
              {products.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-base text-foreground/70 hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-5">
              Компания
            </h3>
            <ul className="space-y-3.5">
              {company.map((link) => (
                <li key={link.href}>
                  {link.hashId ? (
                    <a
                      href={`#${link.hashId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCompanyAnchor(link.hashId);
                      }}
                      className="text-base text-foreground/70 hover:text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-base text-foreground/70 hover:text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contacts */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-5">
              Контакты
            </h3>
            <ul className="space-y-3.5">
              <li>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-2.5 text-base text-foreground/70 hover:text-primary transition-colors duration-300 group"
                >
                  <Mail size={18} className="flex-shrink-0" />
                  <span className="group-hover:underline">
                    {copied ? "Скопировано!" : "hello@neeklo.studio"}
                  </span>
                </button>
              </li>
              <li>
                <a
                  href="https://t.me/neeklo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-base text-foreground/70 hover:text-primary transition-colors duration-300"
                >
                  <Send size={18} className="flex-shrink-0" />
                  @neeklo
                </a>
              </li>
              <li>
                <div className="flex items-center gap-2.5 text-base text-foreground/70">
                  <MapPin size={18} className="flex-shrink-0" />
                  Москва, Россия
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2.5 text-base text-foreground/70">
                  <Hash size={18} className="flex-shrink-0" />
                  ИНН 263514478429
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <p className="text-sm text-foreground/50 text-center sm:text-left">
              © 2026 Neeklo Studio. Все права защищены.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
              <Link
                to="/privacy"
                className="text-sm text-foreground/50 hover:text-foreground transition-colors duration-300"
              >
                Конфиденциальность
              </Link>
              <Link
                to="/terms"
                className="text-sm text-foreground/50 hover:text-foreground transition-colors duration-300"
              >
                Условия
              </Link>
              <Link
                to="/offer"
                className="text-sm text-foreground/50 hover:text-foreground transition-colors duration-300"
              >
                Оферта
              </Link>
              <Link
                to="/consent"
                className="text-sm text-foreground/50 hover:text-foreground transition-colors duration-300"
              >
                Согласие ПДн
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
