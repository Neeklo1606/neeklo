import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Card } from "@/components/common/Card";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  stars: number;
}

interface CaseTestimonialProps {
  testimonial: Testimonial;
}

export const CaseTestimonial = ({ testimonial }: CaseTestimonialProps) => {
  if (!testimonial) return null;

  return (
    <section className="py-12 md:py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="text-center" hover={false}>
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: testimonial.stars }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-2xl md:text-3xl font-heading italic text-foreground mb-8 leading-relaxed">
              "{testimonial.quote}"
            </blockquote>

            {/* Author */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                <span className="text-2xl font-heading font-bold text-primary">
                  {testimonial.author.charAt(0)}
                </span>
              </div>
              
              <div className="font-semibold text-lg text-foreground">
                {testimonial.author}
              </div>
              <div className="text-muted-foreground">
                {testimonial.role}, {testimonial.company}
              </div>
            </div>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
};
