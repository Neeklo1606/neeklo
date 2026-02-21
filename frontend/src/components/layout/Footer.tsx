import { Link, useLocation, useNavigate } from "react-router-dom";
import { Send, Instagram, Mail } from "lucide-react";
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

const INSTAGRAM_URL = "https://www.instagram.com/neeklo.studio";
const TELEGRAM_URL = "https://t.me/neeekn";
const EMAIL = "klochkonikita@mail.ru";

const socialLinks = [
  { icon: Instagram, href: INSTAGRAM_URL, label: "Instagram" },
  { icon: Send, href: TELEGRAM_URL, label: "Telegram" },
];

export const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

          {/* Column 4: Реквизиты и контакты */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-5">
              Реквизиты
            </h3>
            <div className="text-base text-foreground/70 space-y-1.5 mb-5">
              <p>ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ</p>
              <p>КЛОЧКО НИКИТА НИКОЛАЕВИЧ</p>
              <p>ИНН 263520430560</p>
            </div>
            <ul className="space-y-3.5">
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-2.5 text-base text-foreground/70 hover:text-primary transition-colors duration-300"
                >
                  <Mail size={18} className="flex-shrink-0" />
                  <span className="hover:underline">{EMAIL}</span>
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-base text-foreground/70 hover:text-primary transition-colors duration-300"
                >
                  <Instagram size={18} className="flex-shrink-0" />
                  <span className="hover:underline">Instagram</span>
                </a>
                <p className="text-xs text-muted-foreground mt-0.5 ml-7">Meta запрещена в РФ</p>
              </li>
              <li>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-base text-foreground/70 hover:text-primary transition-colors duration-300"
                >
                  <Send size={18} className="flex-shrink-0" />
                  <span className="hover:underline">Telegram</span>
                </a>
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
