import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function MainLayout() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-20 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-primary" />
            </div>
            SkillAlign
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <Link to="/" className="hover:text-primary transition-colors">Features</Link>
            <Link to="/" className="hover:text-primary transition-colors">How It Works</Link>
            <Link to="/insights" className="hover:text-primary transition-colors">Insights</Link>
            <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          </nav>

          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-text-secondary hover:text-foreground transition-colors rounded-full hover:bg-surface-fill cursor-pointer"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            {isLoggedIn ? (
              <Button 
                onClick={handleLogout} 
                variant="ghost" 
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
              >
                Log out
              </Button>
            ) : (
              // Jika belum login, pastikan user TIDAK sedang berada di halaman /auth
              location.pathname !== "/auth" && (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" className="hidden sm:inline-flex cursor-pointer">Log in</Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="cursor-pointer">Get Started</Button>
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
            <span className="font-heading font-semibold">SkillAlign</span>
          </div>
          <div className="text-sm text-text-secondary">
            Powered by DBS Foundation Coding Camp 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
