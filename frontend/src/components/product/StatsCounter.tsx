import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/common/Container";

interface Stat {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

interface StatsCounterProps {
  stats: Stat[];
}

const CounterAnimation = ({ value, prefix = "", suffix = "" }: { value: string; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Extract number from value string
  const numericValue = parseInt(value.replace(/\D/g, "")) || 0;

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = numericValue;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, numericValue]);

  return (
    <span ref={ref}>
      {prefix}
      {isInView ? count : 0}
      {suffix}
    </span>
  );
};

export const StatsCounter = ({ stats }: StatsCounterProps) => {
  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/50 to-background" />
      
      <Container>
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-xl bg-surface/50 border border-border backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {stat.value.match(/\d/) ? (
                  <CounterAnimation 
                    value={stat.value} 
                    prefix={stat.prefix} 
                    suffix={stat.suffix || stat.value.replace(/\d/g, "")} 
                  />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-sm text-foreground-muted">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};
