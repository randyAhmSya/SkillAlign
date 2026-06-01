import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router"; 
import { Button } from "../components/ui/button"; 
import { Input } from "../components/ui/input";   
import { PasswordInput } from "../components/ui/Password-input";
import { toast } from "sonner";
import { Progress } from "../components/ui/progress";
import api from "../lib/axios.ts"; 

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const token = searchParams.get("token");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isLoading) {
      setProgressValue(15); 
      interval = setInterval(() => {
        setProgressValue((prev) => (prev >= 90 ? 90 : prev + Math.floor(Math.random() * 15)));
      }, 300);
    } else {
      setProgressValue(0); 
    }

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("Token hilang!");

    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", { 
        token, 
        newPassword 
      });
      
      setProgressValue(100);
      toast.success("Password berhasil diubah! Silakan login.");
      setTimeout(() => navigate("/auth"), 1500);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mereset password. Token mungkin sudah kedaluwarsa.");
      setIsLoading(false); 
    } 
  };

  if (!token) return <div className="text-center mt-20">Tautan tidak valid.</div>;

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div className="w-80 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col items-center space-y-5 border border-gray-100 dark:border-gray-800 animate-in zoom-in-95">
            <div className="flex flex-col items-center space-y-2 w-full">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 animate-pulse">
                Menyandikan password baru...
              </span>
              <Progress value={progressValue} className="h-2 w-full" />
            </div>
          </div>
        </div>
      )}

      {/* TAMPILAN UTAMA (Akan tertutup popup saat loading) */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md dark:bg-gray-900 border">
          <h1 className="text-2xl font-bold text-center">Buat Password Baru</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Password Baru</label>
              <PasswordInput 
                placeholder="Minimal 8 karakter..." 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            {/* Teks tombol kembali normal, hanya di-disable saja saat loading */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              Simpan Password Baru
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
