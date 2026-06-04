import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import api from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { ProcessPopup } from "./ProcessPopup";
import { 
  FileText, Upload as UploadIcon, X, 
  CheckCircle2, Loader2, ArrowRight, Search 
} from "lucide-react";

interface CVUploadWizardProps {
  onCancel: () => void;
  hasExistingCv?: boolean;
  existingCvId?: string;
}

export function CVUploadWizard({ onCancel, hasExistingCv, existingCvId }: CVUploadWizardProps) {
  const navigate = useNavigate();
  const { fetchUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isSendingFile, setIsSendingFile] = useState(false);
  const [uploadedCvId, setUploadedCvId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [jobResults, setJobResults] = useState<{ id: string; title: string }[]>([]);
  const [selectedJob, setSelectedJob] = useState<{ id: string; title: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [popupState, setPopupState] = useState<{
    isOpen: boolean;
    type: "loading" | "success" | "error";
    title: string;
    subtitle: string;
  }>({ isOpen: false, type: "loading", title: "", subtitle: "" });

  useEffect(() => {
    if (searchTerm.length < 3 || selectedJob) {
      setJobResults([]);
      return;
    }

    const delaySearch = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await api.get(`/jobs?search=${searchTerm}&limit=10`);
        const rawJobs = response.data.data || response.data; 

        if (Array.isArray(rawJobs)) {
          const formattedJobs = rawJobs.map((job: any) => ({
            id: job.id.toString(), 
            title: `${job.title} - ${job.company?.companyName || "Perusahaan Anonim"}`
          }));
          setJobResults(formattedJobs);
        }
      } catch (error) {
        console.error("Gagal memuat daftar pekerjaan:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500); 

    return () => clearTimeout(delaySearch);
  }, [searchTerm, selectedJob]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUploadProcess(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUploadProcess(file);
  };

  const handleUploadProcess = async (file: File) => {
    if (file.type !== "application/pdf") {
      return toast.error("Format dokumen harus berupa PDF!");
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Ukuran file terlalu besar, maksimal 5MB!");
    }

    const formData = new FormData();
    formData.append("cv", file); 

    setStep(2); 
    setIsSendingFile(true);

    try {
      const response = await api.post("/cv/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.data?.id) {
        setUploadedCvId(response.data.data.id);
        toast.success("Teks CV berhasil diekstrak!");
        setStep(3); 
      } else {
        throw new Error("Gagal mendapatkan ID dokumen dari server");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal mengunggah dokumen");
      setStep(1);
    } finally {
      setIsSendingFile(false);
    }
  };

  const handleFinishUpload = async () => {
    if (!selectedJob) return;

    const activeCvId = uploadedCvId || existingCvId;
    
    if (!activeCvId) {
       return toast.error("Gagal mendeteksi CV Anda. Silakan ulangi upload.");
    }

    setIsSendingFile(true);
    
    // Tampilkan Popup Loading Besar
    setPopupState({
      isOpen: true,
      type: "loading",
      title: "Menganalisis Kecocokan",
      subtitle: "AI sedang mencocokkan CV Anda dengan lowongan ini..."
    });

    try {
      await api.post("/match/recommendations/generate", {
          cvUploadId: activeCvId,
          targetJobTitle: selectedJob.title
      });

      await fetchUser(); 
      
      // Ubah Popup menjadi Sukses
      setPopupState({
        isOpen: true,
        type: "success",
        title: "Analisis Selesai!",
        subtitle: "Menyiapkan rekomendasi untuk Anda..."
      });

      // Beri jeda 1.5 detik agar user bisa melihat centang hijau
      setTimeout(() => {
        setPopupState(prev => ({ ...prev, isOpen: false }));
        navigate('/dashboard/jobs');
      }, 1500);
      
    } catch (error: any) {
      console.error(error);
      // Ubah Popup menjadi Error
      setPopupState({
        isOpen: true,
        type: "error",
        title: "Analisis Gagal",
        subtitle: error.response?.data?.message || "Gagal memproses rekomendasi AI."
      });
      // Tutup otomatis setelah 2 detik
      setTimeout(() => setPopupState(prev => ({ ...prev, isOpen: false })), 2000);
    } finally {
      setIsSendingFile(false);
    } 
  };

  return (

    <>
      <ProcessPopup {...popupState} />

      <div className="max-w-2xl mx-auto space-y-12 mt-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-heading font-semibold">Perbarui Dokumen</h2>
          <Button variant="ghost" onClick={onCancel} disabled={isSendingFile} className="cursor-pointer">
            <X size={20} className="mr-2" /> Batal
          </Button>
        </div>

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

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
            <div 
              className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-colors cursor-pointer ${
                isDragging ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()} 
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <UploadIcon size={32} />
              </div>
              <p className="text-lg font-medium mb-2">Drag your CV here or browse</p>
              <p className="text-sm text-text-secondary mb-6">Supported: PDF only • Max 5MB</p>
              <Button variant="secondary" className="cursor-pointer" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Browse Files</Button>
            </div>
            {hasExistingCv && (
              <div className="text-center pt-4 mt-6">
                <p className="text-sm text-text-secondary mb-3">Hanya ingin mencari rekomendasi pekerjaan baru?</p>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto cursor-pointer border-primary/50 text-primary hover:bg-primary/10"
                  onClick={() => setStep(3)}
                >
                  Gunakan CV Saat Ini & Pilih Target Baru
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="text-center space-y-2">
              <h2 className="text-2xl font-heading font-semibold">Analyzing your profile</h2>
              <p className="text-text-secondary">Server sedang mengekstraksi informasi dan kompetensi utama Anda...</p>
            </div>
            <Card className="p-8 flex flex-col items-center justify-center space-y-4 bg-card border-border">
              <Loader2 size={40} className="animate-spin text-primary" />
              <span className="text-sm text-text-secondary animate-pulse">Menghubungkan ke Mesin AI...</span>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} />
              </div>
              <h2 className="text-2xl font-heading font-semibold">CV Processed Successfully</h2>
              <p className="text-text-secondary">Pilih pekerjaan dari database untuk memfokuskan karir Anda.</p>
            </div>

            <Card className="p-8 space-y-6 overflow-visible relative bg-card border-border">
              <div className="space-y-4 relative">
                <label className="text-sm font-medium text-foreground">Target Pekerjaan</label>
                
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Ketik posisi lowongan kerja (cth: Frontend Developer)..."
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-3 pl-10 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary text-foreground"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSelectedJob(null); 
                    }}
                  />
                  <Search className="absolute left-3 top-3 text-text-secondary w-5 h-5" />
                </div>

                {searchTerm.length > 2 && !selectedJob && (
                  <div className="absolute top-full left-0 z-50 w-full mt-1 bg-card border border-border rounded-md shadow-2xl max-h-60 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center text-sm text-text-secondary flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin text-primary" /> Mencari data...
                      </div>
                    ) : jobResults.length > 0 ? (
                      <div className="py-2">
                          {jobResults.map((job) => (
                          <div 
                              key={job.id} 
                              className="px-4 py-2.5 hover:bg-surface-fill cursor-pointer text-sm text-foreground transition-colors border-b border-border/30 last:border-0"
                              onClick={() => {
                                setSelectedJob(job);
                                setSearchTerm(job.title); 
                              }}
                          >
                              {job.title}
                          </div>
                          ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-text-secondary">Pekerjaan tidak ditemukan di database.</div>
                    )}
                  </div>
                )}
              </div>

              <Button 
                size="lg" 
                className="w-full group cursor-pointer mt-8" 
                onClick={handleFinishUpload}
                disabled={!selectedJob || isSendingFile}
              >
                {isSendingFile ? (
                  <span className="flex items-center gap-2 justify-center"><Loader2 size={18} className="animate-spin" /> Menyimpan...</span>
                ) : (
                  <span className="flex items-center gap-1 justify-center">Simpan & Lihat Rekomendasi <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                )}
              </Button>
            </Card>
          </div>
        )}
      </div>
    </> 
  );
}
