import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Moon, Sun, LogOut, Menu, X, CheckCircle2 } from "lucide-react"; 
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import logoSkillAlign from "../../assets/logo-SkillAlign.png";
import { toast } from "sonner";

export function MainLayout() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutStep, setLogoutStep] = useState<"idle" | "confirm" | "success">("idle");
  
  const [isMenuRendered, setIsMenuRendered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  // 👇 Fungsi khusus untuk memaksa tombol merespons klik 👇
  const handleOpenLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLogoutStep("confirm");
  };

  const executeLogout = () => {
    setLogoutStep("success");
    localStorage.removeItem("token");
    toast.success("Berhasil keluar. Sampai jumpa lagi!");
    
    setTimeout(() => {
      setLogoutStep("idle");
      navigate("/");
    }, 1500);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const openMenu = () => {
    setIsMenuRendered(true);
    setTimeout(() => setIsMobileMenuOpen(true), 10); 
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false); 
    setTimeout(() => setIsMenuRendered(false), 300); 
  };

  useEffect(() => {
    if (isMobileMenuOpen) closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      
      {/* POPUP LOGOUT */}
      {logoutStep !== "idle" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-card border border-border shadow-2xl rounded-xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200 text-center">
            
            {logoutStep === "confirm" ? (
              <>
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
                    type="button"
                    variant="outline" 
                    onClick={() => setLogoutStep("idle")} 
                    className="flex-1 cursor-pointer bg-surface-fill hover:bg-surface-fill/80 border-transparent"
                  >
                    Batal
                  </Button>
                  <Button 
                    type="button"
                    onClick={executeLogout} 
                    className="flex-1 cursor-pointer bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    Ya, Keluar
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-4 space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground">
                  Berhasil Keluar!
                </h3>
                <p className="text-sm text-text-secondary">
                  Sampai jumpa lagi. Mengalihkan...
                </p>
              </div>
            )}

          </div>
        </div>
      )}    
      
      {/* OVERLAY & SIDEBAR MOBILE MENU */}
      {isMenuRendered && (
        <div className="md:hidden">
          {/* Overlay gelap */}
          <div 
            className={`fixed inset-0 z-[90] bg-background/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
              isMobileMenuOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeMenu}
          />
          
          {/* Sidebar / Drawer dari kanan */}
          <div 
            className={`fixed inset-y-0 right-0 z-[100] w-[80%] max-w-sm bg-background border-l border-border shadow-2xl flex flex-col px-6 py-8 overflow-y-auto overscroll-contain transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between mb-8 shrink-0">
              <span className="font-heading font-bold text-lg">Menu</span>
              <button 
                type="button"
                onClick={closeMenu}
                className="p-2 -mr-2 text-text-secondary hover:text-foreground transition-colors cursor-pointer rounded-full hover:bg-surface-fill"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-6 text-base font-medium text-text-secondary shrink-0">
              <Link to="/" className="hover:text-primary transition-colors flex items-center gap-2 no-underline" onClick={closeMenu}>Features</Link>
              <Link to="/" className="hover:text-primary transition-colors flex items-center gap-2 no-underline" onClick={closeMenu}>How It Works</Link>
              <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center gap-2 no-underline" onClick={closeMenu}>Dashboard</Link>
            </nav>
            
            <div className="mt-8 mb-6 border-t border-border shrink-0" />
            
            <div className="mt-auto flex flex-col gap-4 shrink-0 pb-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-text-secondary">Tampilan Mode</span>
                {mounted && (
                  <button
                    type="button"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 text-text-secondary hover:text-foreground transition-colors rounded-full hover:bg-surface-fill cursor-pointer border border-border"
                  >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                )}
              </div>

              {isLoggedIn ? (
                <Button 
                  type="button"
                  onClick={(e) => {
                    closeMenu();
                    handleOpenLogout(e);
                  }} 
                  variant="outline" 
                  className="w-full justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer border border-rose-500/20"
                >
                  <LogOut size={18} className="mr-2" /> Log out
                </Button>
              ) : (
                location.pathname !== "/auth" && (
                  <div className="flex flex-col gap-3">
                    <Link to="/auth" className="w-full no-underline" onClick={closeMenu}>
                     <Button type="button" variant="outline" className="w-full border border-border hover:bg-surface-fill cursor-pointer no-underline">Log in</Button>
                    </Link>
                    <Link to="/auth" className="w-full no-underline" onClick={closeMenu}>
                      <Button type="button" className="w-full cursor-pointer no-underline">Get Started</Button>
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* HEADER NAVIGASI UTAMA */}
      {/* ⚠️ relative z-[60] ditambahkan di sini agar Header tidak tertutup elemen dari halaman lain ⚠️ */}
      <header className="h-16 md:h-20 lg:h-24 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-[60] relative">
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between relative z-[60]">
          
          <Link to="/" className="flex items-center gap-2 no-underline">
            <img 
              src={logoSkillAlign} 
              alt="Logo SkillAlign" 
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto transition-all duration-300" 
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <Link to="/" className="hover:text-primary transition-colors no-underline">Features</Link>
            <Link to="/" className="hover:text-primary transition-colors no-underline">How It Works</Link>
            <Link to="/dashboard" className="hover:text-primary transition-colors no-underline">Dashboard</Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-4 relative z-[60]">
            <div className="hidden md:block">
              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 text-text-secondary hover:text-foreground transition-colors rounded-full hover:bg-surface-fill cursor-pointer"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              )}
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn ? (
                // 👇 Ini tombol yang sebelumnya tidak bisa diklik di versi Desktop 👇
                <Button 
                  type="button"
                  onClick={handleOpenLogout} 
                  variant="outline" 
                  className="text-rose-500 border border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-600 no-underline cursor-pointer relative z-[70]"
                >
                  Log out
                </Button>
              ) : (
                location.pathname !== "/auth" && (
                  <>
                    <Link to="/auth" className="no-underline">
                      <Button type="button" variant="outline" className="border border-border hover:bg-surface-fill text-foreground no-underline cursor-pointer relative z-[70]">
                        Log in
                      </Button>
                    </Link>
                    <Link to="/auth" className="no-underline">
                      <Button type="button" className="cursor-pointer no-underline relative z-[70]">Get Started</Button>
                    </Link>
                  </>
                )
              )}
            </div>

            <button 
              type="button"
              onClick={openMenu}
              className="md:hidden p-2 text-text-secondary hover:text-foreground transition-colors cursor-pointer rounded-md hover:bg-surface-fill relative z-[70]"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* ⚠️ z-10 memastikan konten utama selalu berada di bawah hirarki Header ⚠️ */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card py-12 relative z-10">
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
