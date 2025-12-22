import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Baby, Users, Moon, Sun, Droplets, FlaskConical, Stethoscope, BarChart3, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BloodGasDialog from "@/components/BloodGasDialog";
import ElectrolytesDialog from "@/components/ElectrolytesDialog";

const LandingPage = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [bloodGasOpen, setBloodGasOpen] = useState(false);
  const [electrolytesOpen, setElectrolytesOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold text-primary tracking-tight">
            Pediatrics to Go
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center pt-20 pb-24 px-4 md:px-6">
        <div className="w-full max-w-4xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
            Select Department
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NICU Card */}
            <Card
              onClick={() => navigate("/nicu")}
              className="cursor-pointer group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800 overflow-hidden"
              data-testid="nicu-card"
            >
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-6 mb-6 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                  <Baby className="h-12 w-12 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                  NICU
                </h3>
                <p className="text-muted-foreground">
                  Neonatal Intensive Care Unit
                </p>
              </CardContent>
            </Card>

            {/* Children Card */}
            <Card
              className="cursor-not-allowed opacity-60 bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-700"
              data-testid="children-card"
            >
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="bg-secondary/10 rounded-full p-6 mb-6">
                  <Users className="h-12 w-12 text-secondary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                  Children
                </h3>
                <p className="text-muted-foreground mb-3">
                  Pediatric Ward
                </p>
                <span className="px-3 py-1 bg-secondary/20 rounded-full text-xs font-medium text-secondary">
                  Coming Soon
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-lg">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {/* Blood Gas Analysis */}
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setBloodGasOpen(true)}
              className="flex flex-col items-center gap-1 h-auto py-2 px-4 hover:bg-primary/10"
              data-testid="blood-gas-nav"
            >
              <Droplets className="h-6 w-6 text-primary" />
              <span className="text-xs font-medium">Blood Gas</span>
            </Button>

            {/* Electrolytes */}
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setElectrolytesOpen(true)}
              className="flex flex-col items-center gap-1 h-auto py-2 px-4 hover:bg-primary/10"
              data-testid="electrolytes-nav"
            >
              <FlaskConical className="h-6 w-6 text-primary" />
              <span className="text-xs font-medium">Electrolytes</span>
            </Button>

            {/* Future: Stethoscope */}
            <Button
              variant="ghost"
              size="lg"
              disabled
              className="flex flex-col items-center gap-1 h-auto py-2 px-4 opacity-40"
              data-testid="future-nav-1"
            >
              <Stethoscope className="h-6 w-6" />
              <span className="text-xs font-medium">Coming</span>
            </Button>

            {/* Future: Analytics */}
            <Button
              variant="ghost"
              size="lg"
              disabled
              className="flex flex-col items-center gap-1 h-auto py-2 px-4 opacity-40"
              data-testid="future-nav-2"
            >
              <BarChart3 className="h-6 w-6" />
              <span className="text-xs font-medium">Coming</span>
            </Button>

            {/* Future: Profile */}
            <Button
              variant="ghost"
              size="lg"
              disabled
              className="flex flex-col items-center gap-1 h-auto py-2 px-4 opacity-40"
              data-testid="future-nav-3"
            >
              <User className="h-6 w-6" />
              <span className="text-xs font-medium">Coming</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Dialogs */}
      <BloodGasDialog open={bloodGasOpen} onOpenChange={setBloodGasOpen} />
      <ElectrolytesDialog open={electrolytesOpen} onOpenChange={setElectrolytesOpen} />
    </div>
  );
};

export default LandingPage;
