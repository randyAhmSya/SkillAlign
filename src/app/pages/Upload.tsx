import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Upload as UploadIcon, FileText, CheckCircle2, Loader2, ArrowRight, Lock } from "lucide-react";

export function Upload() {
  const [step, setStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        setStep(3);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background flex flex-col items-center py-16 px-6">
      <div className="w-full max-w-2xl space-y-12">
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-border z-0" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-primary z-0 transition-all duration-500" style={{ width: `${(step - 1) * 50}%` }} />
          
          {[
            { num: 1, label: "Upload CV" },
            { num: 2, label: "Analyzing" },
            { num: 3, label: "Target Job" }
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center gap-2 bg-background px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                step > s.num ? "bg-secondary text-white" :
                step === s.num ? "bg-primary text-white ring-4 ring-primary/20" :
                "bg-card text-text-secondary border border-border"
              }`}>
                {step > s.num ? <CheckCircle2 size={20} /> : s.num}
              </div>
              <span className={`text-sm font-medium ${step >= s.num ? "text-foreground" : "text-text-secondary"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-heading font-semibold">Upload your CV</h2>
              <p className="text-text-secondary">We'll extract your skills and experience to build your profile.</p>
            </div>

            <div 
              className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); setStep(2); }}
              onClick={() => setStep(2)}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 cursor-pointer">
                <UploadIcon size={32} />
              </div>
              <p className="text-lg font-medium mb-2">Drag your CV here or browse</p>
              <p className="text-sm text-text-secondary mb-6">Supported: PDF only · Max 5MB</p>
              <Button variant="secondary" className="cursor-pointer">Browse Files</Button>
            </div>
          </div>
        )}

        {/* Step 2: Analyzing */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center space-y-2">
              <h2 className="text-2xl font-heading font-semibold">Analyzing your profile</h2>
              <p className="text-text-secondary">Our AI is extracting and categorizing your skills.</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 space-y-6">
              {[
                { label: "Extracting text from CV...", done: true },
                { label: "Running AI skill matching...", done: false },
                { label: "Computing skill gaps...", done: false }
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-4">
                  {task.done ? (
                    <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
                      <CheckCircle2 size={18} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-surface-fill text-text-secondary flex items-center justify-center">
                      {i === 1 ? <Loader2 size={18} className="animate-spin text-primary" /> : <div className="w-2 h-2 rounded-full bg-text-secondary/50" />}
                    </div>
                  )}
                  <span className={`font-medium ${task.done ? "text-foreground" : i === 1 ? "text-foreground animate-pulse" : "text-text-secondary"}`}>
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
              <h2 className="text-2xl font-heading font-semibold">CV Processed Successfully</h2>
              <p className="text-text-secondary">Now, tell us what role you're aiming for to see your match score.</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 space-y-6 relative overflow-hidden">
              
              {/* Form Input Tetap Ada Agar User "Berinvestasi" Waktu Mengisinya */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Select a target job title</label>
                <select className="flex h-11 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary">
                  <option value="">e.g. Senior Frontend Developer</option>
                  <option value="fe">Frontend Developer</option>
                  <option value="be">Backend Developer</option>
                  <option value="ds">Data Scientist</option>
                </select>
              </div>

              {/* 👇 INI ADALAH BAGIAN GEMBOKNYA 👇 */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex flex-col items-center text-center space-y-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-surface-fill flex items-center justify-center text-text-secondary">
                    <Lock size={18} />
                  </div>
                  <h3 className="font-semibold text-foreground">Hampir Selesai!</h3>
                  <p className="text-sm text-text-secondary max-w-md">
                    Analisis CV Anda sudah siap. Buat akun gratis sekarang untuk melihat *Match Score*, rekomendasi *Skill Gap*, dan menyimpan profil Anda secara permanen.
                  </p>
                </div>

                <Link to="/auth" className="block">
                  <Button size="lg" className="w-full group cursor-pointer">
                    Daftar / Masuk untuk Melihat Hasil
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <p className="text-xs text-text-secondary text-center mt-4">
                  Hanya butuh 30 detik. Tidak perlu kartu kredit.
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}