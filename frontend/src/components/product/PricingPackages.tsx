import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { Check } from "lucide-react";

interface Package {
  name: string;
  price: string;
  recurring?: string;
  features: string[];
  highlighted?: boolean;
}

interface PricingPackagesProps {
  title: string;
  packages: Package[];
}

export const PricingPackages = ({ title, packages }: PricingPackagesProps) => {
  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/50 to-background" />
      
      <Container>
        <motion.h2
          className="text-3xl md:text-4xl font-heading font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              className={`p-8 rounded-2xl border backdrop-blur-sm ${
                pkg.highlighted
                  ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary shadow-lg shadow-primary/20"
                  : "bg-surface/50 border-border"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {pkg.price}
                  </span>
                  {pkg.recurring && (
                    <span className="text-sm text-foreground-muted">/{pkg.recurring}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex gap-3 text-sm">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground-muted">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={pkg.highlighted ? "primary" : "secondary"}
                size="lg"
                className="w-full"
                onClick={() => (window.location.href = "#contact")}
              >
                Выбрать
              </Button>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
