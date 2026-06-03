import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { 
  Upload as UploadIcon, FileText, CheckCircle2, Loader2, ArrowRight, Lock,
  LayoutDashboard, Briefcase, GraduationCap, Settings, Bell, Menu
} from "lucide-react";

export function Upload() {
  const [step, setStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dummyFileName, setDummyFileName] = useState("");

  // Efek simulasi loading palsu (tanpa menyentuh API AI)
  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        setStep(3);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Handler murni untuk UI, mencegah file benar-benar ter-upload
  const handleFakeUpload = (e: any) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer?.files?.[0]) {
      setDummyFileName(e.dataTransfer.files[0].name);
    } else if (e.target?.files?.[0]) {
      setDummyFileName(e.target.files[0].name);
    } else {
      setDummyFileName("document_cv.pdf");
    }
    
    setStep(2);
  };

  const fakeNavItems = [
    { icon: LayoutDashboard, label: "Overview", active: false },
    { icon: FileText, label: "My CV", active: true }, // Disorot karena sedang simulasi fitur ini
    { icon: Briefcase, label: "Job Matches", active: false },
    { icon: GraduationCap, label: "Learning Path", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-surface-fill/30 flex items-center justify-center p-4 sm:p-6 md:p-8">
      
      {/* MOCKUP APP WINDOW (Dashboard Tiruan) */}
      <div className="w-full max-w-6xl h-[800px] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Floating Badge Label */}
        <div className="absolute top-4 right-1/2 translate-x-1/2 md:right-6 md:translate-x-0 z-50 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in slide-in-from-top-4 duration-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          Interactive Preview
        </div>

        {/* FAKE SIDEBAR (Hanya Tampilan) */}
        <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card select-none">
          <div className="p-6 flex items-center gap-2 mb-6 opacity-60">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-primary" />
            </div>
            <span className="text-xl font-heading font-semibold">SkillAlign</span>
          </div>

          <div className="px-4 mb-6 flex items-center gap-3 opacity-60">
            <div className="w-10 h-10 rounded-full bg-surface-fill flex items-center justify-center font-semibold text-text-secondary">
              GU
            </div>
            <div>
              <div className="font-medium text-sm">Guest User</div>
              <div className="text-xs text-text-secondary">guest@example.com</div>
            </div>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {fakeNavItems.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active 
                    ? "bg-secondary/10 text-primary border-l-[3px] border-l-primary" 
                    : "text-text-secondary opacity-50"
                }`}
              >
                <item.icon size={18} className={item.active ? "text-primary" : ""} />
                {item.label}
                {!item.active && <Lock size={12} className="ml-auto opacity-40" />}
              </div>
            ))}
          </nav>
        </aside>

        {/* FAKE MAIN CONTENT */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          
          {/* FAKE HEADER */}
          <header className="h-16 border-b border-border bg-card/80 flex items-center justify-between px-4 md:px-6 select-none">
            <div className="flex items-center gap-3 md:hidden opacity-60">
              <Menu size={20} />
              <span className="font-medium">My CV</span>
            </div>
            <h1 className="text-lg font-medium text-foreground hidden md:block">
              My CV
            </h1>
            <div className="flex items-center gap-4 opacity-60">
              <span className="text-sm text-text-secondary hidden sm:block">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              <div className="p-2 text-text-secondary rounded-full">
                <Bell size={20} />
              </div>
            </div>
          </header>

          {/* AREA UPLOAD WIZARD ASLI */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center">
            <div className="w-full max-w-2xl space-y-12 pb-10">
              
              {/* Progress Stepper */}
              <div className="flex items-center justify-between relative mt-4">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-border z-0" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-primary z-0 transition-all duration-500" style={{ width: `${(step - 1) * 50}%` }} />
                
                {[
                  { num: 1, label: "Upload CV" },
                  { num: 2, label: "Analyzing" },
                  { num: 3, label: "Target Job" }
                ].map((s) => (
                  <div key={s.num} className="relative z-10 flex flex-col items-center gap-2 bg-background px-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors shadow-sm ${
                      step > s.num ? "bg-secondary text-white" :
                      step === s.num ? "bg-primary text-white ring-4 ring-primary/20" :
                      "bg-card text-text-secondary border border-border"
                    }`}>
                      {step > s.num ? <CheckCircle2 size={20} /> : s.num}
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${step >= s.num ? "text-foreground" : "text-text-secondary"}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 1: Upload (DUMMY UPLOAD) */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-heading font-semibold">Coba Gratis SkillAlign</h2>
                    <p className="text-text-secondary">Unggah CV Anda untuk melihat bagaimana UI Dashboard kami mengekstrak profil Anda.</p>
                  </div>

                  <label
                    className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-all cursor-pointer ${
                      isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border bg-card hover:border-primary/50 hover:bg-surface-fill/50 hover:shadow-md"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFakeUpload}
                  >
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx" 
                      onChange={handleFakeUpload} 
                    />
                    
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <UploadIcon size={32} />
                    </div>
                    <p className="text-lg font-medium mb-2">Drag & Drop CV Anda di sini</p>
                    <p className="text-sm text-text-secondary mb-6">Format yang didukung: PDF (Max 5MB)</p>
                    <Button variant="secondary" className="pointer-events-none shadow-sm">Jelajahi File</Button>
                  </label>
                </div>
              )}

              {/* Step 2: Analyzing (VISUAL SIMULATION) */}
              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="text-center space-y-2">
                    <h2 className="text-2xl font-heading font-semibold">Memproses Dokumen...</h2>
                    <p className="text-text-secondary">AI kami sedang membaca struktur <span className="font-semibold text-foreground">{dummyFileName || "CV Anda"}</span>.</p>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
                    {[
                      { label: "Mengekstrak teks dari dokumen...", done: true },
                      { label: "Mengidentifikasi riwayat pekerjaan...", done: false },
                      { label: "Menganalisis matriks skill gap...", done: false }
                    ].map((task, i) => (
                      <div key={i} className="flex items-center gap-4">
                        {task.done ? (
                          <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
                            <CheckCircle2 size={18} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-surface-fill text-text-secondary flex items-center justify-center shrink-0">
                            {i === 1 ? <Loader2 size={18} className="animate-spin text-primary" /> : <div className="w-2 h-2 rounded-full bg-text-secondary/50" />}
                          </div>
                        )}
                        <span className={`font-medium text-sm sm:text-base ${task.done ? "text-foreground" : i === 1 ? "text-foreground animate-pulse" : "text-text-secondary"}`}>
                          {task.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Target Job & "GEMBOK" AUTHENTIKASI */}
              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText size={32} />
                    </div>
                    <h2 className="text-2xl font-heading font-semibold">Dokumen Siap Dianalisis!</h2>
                    <p className="text-text-secondary">Pilih peran target Anda untuk membandingkan kecocokan skill.</p>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-sm">
                    
                    <div className="space-y-4">
                      <label className="text-sm font-medium">Pilih Pekerjaan Impian Anda</label>
                      <select className="flex h-11 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary">
                        <option value="">Contoh: Senior Software Engineer</option>
                        <option value="fe">Frontend Developer</option>
                        <option value="be">Backend Developer</option>
                        <option value="ds">Data Scientist</option>
                        <option value="ux">UI/UX Designer</option>
                      </select>
                    </div>

                    {/* 👇 INI ADALAH BAGIAN GEMBOKNYA 👇 */}
                    <div className="mt-8 pt-6 border-t border-border">
                      <div className="flex flex-col items-center text-center space-y-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                          <Lock size={18} />
                        </div>
                        <h3 className="font-semibold text-foreground">Satu Langkah Lagi!</h3>
                        <p className="text-sm text-text-secondary max-w-md leading-relaxed">
                          Ini adalah tampilan Pratinjau Interaktif. Untuk membuka skor kecocokan Anda yang sebenarnya, Anda perlu membuat akun gratis.
                        </p>
                      </div>

                      <Link to="/auth" className="block">
                        <Button size="lg" className="w-full group cursor-pointer shadow-md">
                          Daftar / Masuk untuk Melihat Hasil
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      
                      <p className="text-xs text-text-secondary text-center mt-4 font-medium">
                        Hanya butuh 15 detik menggunakan Google.
                      </p>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
