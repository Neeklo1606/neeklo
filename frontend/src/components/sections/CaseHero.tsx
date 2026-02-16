import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";

interface CaseHeroProps {
  title: string;
  category: string;
  coverPoster: string;
  year: number;
}

export const CaseHero = ({ title, category, coverPoster, year }: CaseHeroProps) => {
  return (
    <section className="relative min-h-[70vh] flex items-end justify-center overflow-hidden">
      {/* Background Image/Video */}
      <div className="absolute inset-0 -z-10">
        {/* Hero Image with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background">
          <img 
            src={!coverPoster ? '' : coverPoster.startsWith('http') || coverPoster.startsWith('/') ? coverPoster : `/cases/${coverPoster}`} 
            alt={title}
            className="w-full h-full object-cover opacity-30"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
          />
        </div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
      </div>

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pb-20"
        >
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full text-sm font-medium text-primary uppercase tracking-wider">
              {category}
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-foreground mb-4">
            {title}
          </h1>
          
          <p className="text-xl text-muted-foreground">
            {year}
          </p>
        </motion.div>
      </Container>
    </section>
  );
};
