import { useNavigate } from "react-router-dom";
import { Baby, Users } from "lucide-react";
import Layout from "@/components/Layout";
import FloatingNavBar from "@/components/FloatingNavBar";

const LandingPage = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();

  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6 pt-20 pb-32">
        {/* Department Selection */}
        <div className="space-y-4">
          {/* NICU Card */}
          <div 
            onClick={() => navigate("/nicu")}
            className="selection-card group"
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#00d9c5]/10 flex items-center justify-center group-hover:bg-[#00d9c5]/20 transition-colors">
                  <Baby className="h-7 w-7 text-[#00d9c5]" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    NICU
                  </h2>
                  <p className="text-muted-foreground">
                    Neonatal Intensive Care Unit
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Children Card */}
          <div 
            onClick={() => navigate("/children")}
            className="selection-card group"
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Users className="h-7 w-7 text-purple-500" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    Children
                  </h2>
                  <p className="text-muted-foreground">
                    Pediatric Ward
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Nav Bar */}
      <FloatingNavBar showHome={false} />
    </Layout>
  );
};

export default LandingPage;
