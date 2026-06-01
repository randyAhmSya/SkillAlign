import { useState } from "react";
import { Link } from "react-router"; 
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import api from "../lib/axios";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Email wajib diisi!");

    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      
      setIsSent(true);
      toast.success("Tautan reset password berhasil dikirim!");
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengirim email. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md dark:bg-gray-900 border">
        
        {/* Tombol Back */}
        <Link to="/auth" className="inline-flex items-center text-sm text-text-secondary hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Kembali ke Login
        </Link>

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Lupa Password?</h1>
          <p className="text-sm text-text-secondary">
            Jangan khawatir! Masukkan email yang terdaftar, dan kami akan mengirimkan tautan untuk membuat password baru.
          </p>
        </div>

        {isSent ? (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center space-y-3">
            <p className="text-green-600 dark:text-green-400 font-medium">Email Terkirim!</p>
            <p className="text-sm text-text-secondary">
              Silakan cek kotak masuk atau folder spam di email <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input 
                type="email" 
                placeholder="Masukkan email Anda..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Mengirim Email..." : "Kirim Tautan Reset"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
