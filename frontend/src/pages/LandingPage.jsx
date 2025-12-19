import { useNavigate } from "react-router-dom";
import { Baby, Users, Moon, Sun, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold text-foreground tracking-tight">
            FluidCal
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="theme-toggle"
            className="rounded-full"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 flex flex-col md:flex-row pt-16">
        {/* NICU Section */}
        <div
          onClick={() => navigate("/nicu")}
          className="landing-section flex-1 relative overflow-hidden cursor-pointer group bg-teal-50 dark:bg-teal-950/30"
          data-testid="nicu-section"
        >
          <img
            src="https://images.unsplash.com/photo-1740853265752-fb0c80daed78?crop=entropy&cs=srgb&fm=jpg&q=85"
            alt="NICU care"
            className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-20 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[40vh] md:min-h-[calc(100vh-4rem)] p-8">
            <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-6 mb-6 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
              <Baby className="h-16 w-16 text-primary" />
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
              NICU
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Neonatal Intensive Care Unit
            </p>
            <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
              <span>Start Calculator</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Children Section (Coming Soon) */}
        <div
          className="landing-section flex-1 relative overflow-hidden cursor-not-allowed group bg-slate-100 dark:bg-slate-900/30"
          data-testid="children-section"
        >
          <img
            src="https://images.unsplash.com/photo-1757737488436-503bd810646d?crop=entropy&cs=srgb&fm=jpg&q=85"
            alt="Pediatric care"
            className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-10 grayscale mix-blend-overlay"
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[40vh] md:min-h-[calc(100vh-4rem)] p-8 opacity-60">
            <div className="bg-secondary/10 rounded-full p-6 mb-6">
              <Users className="h-16 w-16 text-secondary" />
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
              Children
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Pediatric Ward
            </p>
            <span className="px-4 py-2 bg-secondary/20 rounded-full text-sm font-medium text-secondary">
              Coming Soon
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
