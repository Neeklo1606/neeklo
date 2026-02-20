import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { useMetaTags } from "@/hooks/useMetaTags";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useMetaTags(
    "404 — Страница не найдена | Neeklo Studio",
    "К сожалению, запрашиваемая страница не найдена. Вернитесь на главную страницу Neeklo Studio.",
    "https://neeklo.ru/og-home.jpg"
  );

  // Track 404 errors in production with analytics
  useEffect(() => {
    // TODO: Send to analytics service in production
    // analytics.track('404_error', { path: location.pathname });
  }, [location.pathname]);

  return (
    <main
      className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background pt-24 md:pt-28 pb-12"
      role="main"
      aria-label="Страница не найдена"
    >
      <div className="text-center max-w-md px-4">
        <h1 className="mb-4 text-8xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-heading font-semibold text-foreground">
          Страница не найдена
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          К сожалению, страница, которую вы ищете, не существует или была перемещена.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" size="lg" className="w-full sm:w-auto group">
              <Home className="mr-2 w-5 h-5" />
              На главную
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto group"
          >
            <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Назад
          </Button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
