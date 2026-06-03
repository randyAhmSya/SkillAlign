import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { RadarChart } from "../components/RadarChart";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router";
import api from "../lib/axios";
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from "sonner";

const chartData = [
  { subject: "React", A: 80, B: 90 },
  { subject: "Python", A: 60, B: 70 },
  { subject: "SQL", A: 90, B: 80 },
  { subject: "Cloud", A: 40, B: 60 },
  { subject: "UI/UX", A: 70, B: 50 },
  { subject: "Agile", A: 85, B: 75 },
];

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      setErrorMsg("");
      
      try {
        const response = await api.post("/auth/google", { 
          access_token: tokenResponse.access_token 
        });
        const { token } = response.data;
        
        localStorage.setItem("token", token);
        
        // Popup sukses (hijau)
        toast.success("Login Google berhasil!");
        setTimeout(() => navigate("/dashboard"), 1000);
        
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Gagal terhubung ke server saat login dengan Google.";
        
        setErrorMsg(message);
        console.error("[Google Login Error]:", error);
        
        // Popup error (merah)
        toast.error(message);
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setErrorMsg("Batal login menggunakan Google.");
      toast.error("Batal login menggunakan Google.");
    },
  });

  const handleTabSwitch = (toLogin: boolean) => {
    setIsLogin(toLogin);
    setErrorMsg("");
    setEmail("");
    setPassword("");
    setName("");
    setShowPassword(false);
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (isLogin) {
        const response = await api.post("/auth/login", { email, password });
        const { token } = response.data;
        localStorage.setItem("token", token);
        
        toast.success("Login berhasil! Mengalihkan ke dashboard...");
        navigate("/dashboard");

      } else {
        await api.post("/auth/register", { name, email, password });
        
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setName("");
        setErrorMsg("");
        
        toast.success("Pendaftaran berhasil! Silakan Sign In dengan akun barumu.");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Terjadi kesalahan pada server.";
      
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      
      {/* 👇 OVERLAY LOADING DI TENGAH LAYAR 👇 */}
      {(isLoading || isGoogleLoading) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border shadow-2xl rounded-2xl p-8 flex flex-col items-center max-w-sm w-full mx-4 text-center animate-in zoom-in-95 duration-300">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
              {isGoogleLoading ? "Memverifikasi Google..." : isLogin ? "Sedang masuk..." : "Membuat akun..."}
            </h3>
            <p className="text-sm text-text-secondary">Mohon tunggu sebentar, kami sedang menyiapkan semuanya untuk Anda.</p>
          </div>
        </div>
      )}

      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-gradient-to-br from-primary-light/20 to-secondary-light/20 p-12 relative overflow-hidden">
        <Link
          to="/"
          className="inline-flex items-center text-text-secondary hover:text-foreground transition-colors z-10 w-fit"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Home
        </Link>

        <div className="z-10 max-w-lg mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-primary" />
            </div>
            <span className="text-3xl font-heading font-semibold">
              SkillAlign
            </span>
          </div>
          <h1 className="text-4xl font-heading font-semibold mb-6 leading-tight">
            Stop guessing what skills you need. Start aligning with your dream
            job.
          </h1>
          <p className="text-lg text-text-secondary">
            Join thousands of professionals using AI to navigate their career
            paths with precision.
          </p>
        </div>

        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] opacity-40 translate-x-1/4 translate-y-1/4 pointer-events-none">
          <RadarChart data={chartData} userKey="A" industryKey="B" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
        <div className="w-full max-w-[480px]">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-primary" />
            </div>
            <span className="text-2xl font-heading font-semibold">
              SkillAlign
            </span>
          </div>

          <Card className="w-full shadow-lg relative overflow-hidden">
            <div className="flex mb-8 border-b border-border">
              <button
                className={`flex-1 pb-4 text-center font-medium transition-colors cursor-pointer border-b-2 ${isLogin
                    ? "border-primary text-foreground"
                    : "border-transparent text-text-secondary hover:text-foreground"
                  }`}
                onClick={() => handleTabSwitch(true)}
              >
                Sign In
              </button>
              <button
                className={`flex-1 pb-4 text-center font-medium transition-colors cursor-pointer border-b-2 ${!isLogin
                    ? "border-primary text-foreground"
                    : "border-transparent text-text-secondary hover:text-foreground"
                  }`}
                onClick={() => handleTabSwitch(false)}
              >
                Create Account
              </button>
            </div>
            
            {errorMsg && (
              <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500 text-sm text-center animate-in fade-in zoom-in duration-300">
                {errorMsg}
              </div>
            )}

            {isLogin ? (
              <form className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300" onSubmit={handleAuth}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 cursor-pointer"
                  size="lg"
                >
                  Login
                </Button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-text-secondary">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full cursor-pointer hover:bg-surface-fill" 
                  type="button"
                  onClick={() => loginWithGoogle()} 
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </Button>
              </form>
            ) : (
              <form className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300" onSubmit={handleAuth}>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
               <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 cursor-pointer"
                  size="lg"
                >
                  Create Account
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
