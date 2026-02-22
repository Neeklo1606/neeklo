import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import casesData from "@/data/cases.json";

interface CaseNavigationProps {
  currentId: number;
}

export const CaseNavigation = ({ currentId }: CaseNavigationProps) => {
  const currentIndex = casesData.findIndex(c => c.id === currentId);
  const prevCase = currentIndex > 0 ? casesData[currentIndex - 1] : null;
  const nextCase = currentIndex < casesData.length - 1 ? casesData[currentIndex + 1] : null;

  if (!prevCase && !nextCase) return null;

  return (
    <section className="py-12 md:py-16 border-t border-border">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Previous Case */}
          {prevCase ? (
            <Link
              to={`/work/${prevCase.slug}`}
              className="group relative overflow-hidden rounded-2xl glass-card hover:border-primary/50 transition-all duration-300 p-8"
            >
              <div className="flex items-center text-muted-foreground group-hover:text-primary transition-colors mb-4">
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="text-sm uppercase tracking-wider">Предыдущий проект</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                {prevCase.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {prevCase.category}
              </p>
            </Link>
          ) : (
            <div />
          )}

          {/* Next Case */}
          {nextCase ? (
            <Link
              to={`/work/${nextCase.slug}`}
              className="group relative overflow-hidden rounded-2xl glass-card hover:border-primary/50 transition-all duration-300 p-8 text-right"
            >
              <div className="flex items-center justify-end text-muted-foreground group-hover:text-primary transition-colors mb-4">
                <span className="text-sm uppercase tracking-wider">Следующий проект</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                {nextCase.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {nextCase.category}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </Container>
    </section>
  );
};
