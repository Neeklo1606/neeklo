import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { useMetaTags } from "@/hooks/useMetaTags";
import { ArrowLeft, Check, MessageCircle, Clock, CreditCard, AlertTriangle } from "lucide-react";
import servicesData from "@/data/services.json";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = servicesData.services.find((s) => s.slug === slug);

  useMetaTags(
    service ? `${service.title} | Neeklo Studio` : "Услуга не найдена",
    service?.excerpt || "",
    "https://neeklo.ru/og-services.jpg",
    `https://neeklo.ru/services/${slug}`,
    service?.excerpt || ""
  );

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 md:pt-32 pb-[max(5rem,env(safe-area-inset-bottom)+3.5rem)] lg:pb-20">
        <Container>
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-8"
          >
            <Link 
              to="/services"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Все услуги
            </Link>
          </motion.div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 md:mb-16"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
              {service.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
              {service.excerpt}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10 md:space-y-12">
              {/* Problem section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="p-6 md:p-8 rounded-2xl bg-destructive/5 border border-destructive/20"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-heading font-bold mb-3 text-foreground">
                      Ключевая проблема
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.problem}
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Solution section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-foreground">
                  Что делаем и результат
                </h2>
                <ul className="space-y-3">
                  {service.solution.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-card/50 border border-border/50"
                    >
                      <div 
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                        style={{ backgroundColor: `${service.accentColor}20` }}
                      >
                        <Check 
                          className="w-4 h-4" 
                          style={{ color: service.accentColor }}
                        />
                      </div>
                      <span className="text-foreground">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.section>

              {/* Formats section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-6 md:p-8 rounded-2xl bg-card/50 border border-border/50"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-heading font-bold mb-3 text-foreground">
                      Форматы и сроки
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.formats}
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Price section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-heading font-bold mb-3 text-foreground">
                      Ориентировочная стоимость
                    </h2>
                    <p className="text-2xl md:text-3xl font-bold text-primary mb-2">
                      {service.price}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Финальная цена формируется после консультации и зависит от объёма задач
                    </p>
                  </div>
                </div>
              </motion.section>
            </div>

            {/* Sidebar CTA */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-28">
                <div 
                  className="p-6 md:p-8 rounded-2xl bg-card border border-border/50"
                  style={{ 
                    boxShadow: `0 8px 32px ${service.accentColor}15`
                  }}
                >
                  <h3 className="text-xl md:text-2xl font-heading font-bold mb-4 text-foreground">
                    Обсудим ваш проект?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Расскажите о задаче, и мы предложим оптимальное решение
                  </p>
                  
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      variant="primary"
                      className="w-full"
                      onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                    >
                      Оставить заявку
                    </Button>
                    
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full group"
                      onClick={() => window.open('https://t.me/neeekn', '_blank')}
                    >
                      <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Написать в Telegram
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      Среднее время ответа: <span className="text-foreground font-medium">2 часа</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
