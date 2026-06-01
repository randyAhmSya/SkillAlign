import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Loader2, Eye, EyeOff } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import api from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { ConfirmModal } from "../components/ConfirmModal";


export function Settings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(""); 
  const [headline, setHeadline] = useState(""); 
  const [location, setLocation] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { user, fetchUser, aiSuggestions, fetchAiSuggestions } = useAuthStore();

  const [activeTab, setActiveTab] = useState("account");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchUser(); 
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
      
      if (user.profile) {
        setAvatarUrl(user.profile.avatarUrl || null);
        setHeadline(user.profile.headline || "");
        setLocation(user.profile.location || "");
        if (typeof user.profile.careerPrefs === 'object' && user.profile.careerPrefs !== null) {
          setCareerGoal(user.profile.careerPrefs.title || "");
        } else {
          setCareerGoal(user.profile.careerPrefs || "");
        }


      }

      fetchAiSuggestions(user.id);
    }
  }, [user, fetchAiSuggestions]);


  useEffect(() => {
    const fetchRecommendations = async () => {
      const cachedSuggestions = localStorage.getItem("skillalign_suggestions_cache");
      if (cachedSuggestions) {
        setSuggestions(JSON.parse(cachedSuggestions));
      }

      try {
        const cvRes = await api.get("/cv");
        const cvs = cvRes.data?.data || cvRes.data;
        
        if (Array.isArray(cvs) && cvs.length > 0) {
          const latestCvId = cvs[0].id;
          const detailRes = await api.get(`/cv/${latestCvId}`);
          const cvDetail = detailRes.data?.data || detailRes.data;
          
          if (cvDetail?.aiAnalysis?.suggested_job_titles) {
            const titles = cvDetail.aiAnalysis.suggested_job_titles.map(
              (job: any) => job.title
            );
            
            setSuggestions(titles);
            
            localStorage.setItem("skillalign_suggestions_cache", JSON.stringify(titles));
          }
        } else {
          localStorage.removeItem("skillalign_suggestions_cache");
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Gagal memuat rekomendasi CV:", error);
      }
    };

    fetchRecommendations();
  }, []);

  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPwd(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: oldPassword,
        newPassword: newPassword
      });
      toast.success("Password berhasil diubah!");
      setOldPassword("");
      setNewPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengubah password");
    } finally {
      setIsChangingPwd(false);
    }
  };
  const { logout } = useAuthStore();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar terlalu besar. Maksimal 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploading(true);
    
    try {
      const response = await api.put("/users/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const responseData = response.data as any;
      
      const newAvatarUrl = responseData.data?.avatarUrl || responseData.avatarUrl;
      setAvatarUrl(newAvatarUrl);
      
      toast.success("Foto profil berhasil diperbarui!");
      
    } catch (error: any) {
      console.error(error);
      
      const errorData = error.response?.data as any;
      const message = errorData?.message || errorData?.error || "Gagal mengunggah foto profil";
      
      toast.error(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await api.put("/users/profile", {
        name: fullName,
        headline: headline,
        location: location,
        careerPrefs: {
          title: careerGoal
        },
      });

      toast.success("Profil berhasil diperbarui!");
      await fetchUser(true);
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan perubahan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-semibold">Settings</h2>
        <p className="text-text-secondary">Manage your account and preferences.</p>
      </div>

      <div className="grid md:grid-cols-[200px_1fr] gap-8">
        {/* Settings Nav */}
        <div className="space-y-1">
          <button 
            onClick={() => setActiveTab("account")}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "account" ? "bg-surface-fill text-foreground" : "text-text-secondary hover:text-foreground cursor-pointer"}`}
          >
            Account
          </button>
          <button 
            onClick={() => setActiveTab("appearance")}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "appearance" ? "bg-surface-fill text-foreground" : "text-text-secondary hover:text-foreground cursor-pointer"}`}
          >
            Appearance
          </button>
          <button 
            onClick={() => setActiveTab("privacy")}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "privacy" ? "bg-surface-fill text-foreground" : "text-text-secondary hover:text-foreground cursor-pointer"}`}
          >
            Privacy & Security
          </button>
        </div>

        {/* Settings Content */}
        <div className="space-y-8">
          {activeTab === "account" && (
          <Card className="p-6 space-y-6">
            <h3 className="font-heading font-semibold text-lg border-b border-border pb-4">Profile Information</h3>
            
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-surface-fill border border-border flex items-center justify-center text-2xl font-semibold text-text-secondary">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  "JD" 
                )}
              </div>
              <div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mb-2" 
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {isUploading ? "Uploading..." : "Change Avatar"}
                </Button>
                <div className="text-xs text-text-secondary">JPG, GIF or PNG. Max size 2MB.</div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/gif, image/webp" 
                  onChange={handleAvatarChange} 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  placeholder="Masukkan nama lengkap" />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input 
                  value={email} 
                  readOnly 
                  className="opacity-70 bg-surface-fill/50 cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Professional Headline</Label>
                <Input 
                  value={headline} 
                  onChange={(e) => setHeadline(e.target.value)} 
                  placeholder="Contoh: Mahasiswa TRPL Poliwangi" 
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  placeholder="Contoh: Banyuwangi, Indonesia" 
                />
              </div>
            </div>
            
<div className="space-y-2 relative mb-8">
              <Label>Career Goal</Label>
              <div className="relative">
                <input 
                  type="text" 
                  value={careerGoal} 
                  onChange={(e) => setCareerGoal(e.target.value)} 
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setShowSuggestions(false)}
                  placeholder="Contoh: Frontend Developer"
                  className="flex h-11 w-full rounded-lg border border-input focus-visible:border-rose-400 focus-visible:ring-1 focus-visible:ring-rose-400 bg-transparent px-4 text-sm focus-visible:outline-none text-foreground transition-colors"
                />
                
                {/* Dropdown Menu */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-[48px] left-0 z-50 w-full bg-card border border-border rounded-lg shadow-2xl max-h-48 overflow-y-auto p-2">
                    <p className="text-[11px] text-text-secondary font-bold mb-2 px-2 uppercase tracking-wider">
                      ✨ Rekomendasi AI dari CV-mu
                    </p>
                    
                    {suggestions.map((title, idx) => (
                      <div 
                        key={idx}
                        className="px-3 py-2.5 hover:bg-surface-fill cursor-pointer text-sm text-foreground transition-colors rounded-md truncate"
                        onMouseDown={(e) => {
                          e.preventDefault(); 
                          setCareerGoal(title);
                          setShowSuggestions(false);
                        }}
                      >
                        {title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <p className="text-[12px] text-rose-400 font-medium pt-1">
                ✨ Klik kotak input untuk melihat rekomendasi berdasarkan CV-mu!
              </p>
            </div>

            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </Card>
          )}

          {activeTab === "appearance" && (
          <Card className="p-6 space-y-6">
            <h3 className="font-heading font-semibold text-lg border-b border-border pb-4">Appearance</h3>
            
            <div className="space-y-4">
              <Label>Theme</Label>
              {mounted && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${theme === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card text-text-secondary hover:border-primary/50'}`}
                  >
                    <Sun size={18} /> Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${theme === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card text-text-secondary hover:border-primary/50'}`}
                  >
                    <Moon size={18} /> Dark
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${theme === 'system' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card text-text-secondary hover:border-primary/50'}`}
                  >
                    <Monitor size={18} /> System
                  </button>
                </div>
              )}
            </div>
          </Card>
          )}

          {activeTab === "privacy" && (
          <Card className="p-6 space-y-6 border-destructive/30">
            <div className="space-y-8">
              {/* Kartu Ganti Password */}
              <Card className="p-6 space-y-6">
                <h3 className="font-heading font-semibold text-lg border-b border-border pb-4">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {/* Input Password Lama */}
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <div className="relative">
                      <Input 
                        type={showOldPassword ? "text" : "password"} 
                        value={oldPassword} 
                        onChange={(e) => setOldPassword(e.target.value)} 
                        required 
                        className="pr-10" // Beri jarak agar teks tidak tertutup ikon
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground transition-colors"
                      >
                        {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Input Password Baru */}
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <div className="relative">
                      <Input 
                        type={showNewPassword ? "text" : "password"} 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                        className="pr-10"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground transition-colors"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" disabled={isChangingPwd} className={isChangingPwd ? "cursor-not-allowed opacity-50" : "cursor-pointer"}>
                    {isChangingPwd ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </Card>

              {/* Kartu Logout Zone */}
              <Card className="p-6 space-y-6 border-destructive/30">
                <h3 className="font-heading font-semibold text-lg text-destructive border-b border-destructive/20 pb-4">Session</h3>
                <p className="text-sm text-text-secondary">Keluar dari akun Anda di perangkat ini.</p>
                <Button 
                  onClick={() => setShowLogoutModal(true)} 
                  variant="outline" 
                  className="text-destructive border-destructive hover:bg-destructive hover:text-white cursor-pointer"
                >
                  Logout
                </Button>
              </Card>
            </div>
          </Card>
          )}
        </div>
      </div>
      <ConfirmModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
        title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin keluar dari aplikasi? Anda harus login kembali untuk mengakses profil Anda."
        confirmText="Ya, Keluar"
        isDestructive={true} 
      />
    </div>
  );
}
