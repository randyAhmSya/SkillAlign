import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function MainLayout() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // State untuk mengontrol munculnya popup konfirmasi logout
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  // Fungsi yang benar-benar melakukan logout
  const executeLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutConfirm(false);
    navigate("/");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      
      {/* 👇 MODAL KONFIRMASI LOGOUT 👇 */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-card border border-border shadow-2xl rounded-xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              Konfirmasi Logout
            </h3>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Apakah Anda yakin ingin keluar? Anda harus login kembali untuk mengakses profil karier Anda.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowLogoutConfirm(false)} 
                className="flex-1 cursor-pointer bg-surface-fill hover:bg-surface-fill/80 border-transparent"
              >
                Batal
              </Button>
              <Button 
                onClick={executeLogout} 
                className="flex-1 cursor-pointer bg-rose-500 hover:bg-rose-600 text-white"
              >
                Ya, Keluar
              </Button>
            </div>
          </div>
        </div>
      )}

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
                // 👇 Ubah onClick menjadi memanggil modal konfirmasi
                onClick={() => setShowLogoutConfirm(true)} 
                variant="ghost" 
                className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
              >
                Log out
              </Button>
            ) : (
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
