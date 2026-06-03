import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import api from "../lib/axios";
import { HistoryCard } from "../components/HistoryCard";
import { CVUploadWizard } from "../components/CVUploadWizard"; 
import { InfoPopup } from "../components/InfoPopup";
import { 
  FileText, Download, Upload as UploadIcon, ExternalLink, 
  Loader2, Clock, Trash2 
} from "lucide-react";


interface CVAnalysis {
  role: string;
  experience: string;
  education: string;
  skills: string[];
}

interface CVData {
  id: string;
  fileName: string;
  uploadedAt: string;
  fileUrl: string;
}

export function CV() {
  const [isUploading, setIsUploading] = useState(false);
  const [isFetchingInitial, setIsFetchingInitial] = useState(true);
  
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [cvHistory, setCvHistory] = useState<any[]>([]); 
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis>({
    role: "Belum Ada Data", experience: "-", education: "-", skills: []
  });

  useEffect(() => {
    const fetchLatestCV = async () => {
      const cachedData = localStorage.getItem("skillalign_cv_cache");
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setCvData(parsed.cvData);
        if (parsed.cvAnalysis) setCvAnalysis(parsed.cvAnalysis);
        setIsFetchingInitial(false);
      }

      try {
        const listRes = await api.get("/cv");
        const cvs = listRes.data?.data || listRes.data;
        
        if (Array.isArray(cvs) && cvs.length > 0) {
          setCvHistory(cvs); 
          
          const latestCvId = cvs[0].id;
          const detailRes = await api.get(`/cv/${latestCvId}`);
          const cvDetail = detailRes.data?.data || detailRes.data;
          
          if (cvDetail) {
            const newCvData = {
              id: cvDetail.id,
              fileName: cvDetail.fileName,
              uploadedAt: new Date(cvDetail.uploadedAt).toLocaleDateString("id-ID", {
                day: "numeric", month: "long", year: "numeric"
              }),
              fileUrl: cvDetail.fileUrl
            };

            let newAnalysis = null;
            if (cvDetail.aiAnalysis) {
              newAnalysis = {
                role: cvDetail.aiAnalysis.current_role || "Tidak terdeteksi",
                experience: cvDetail.aiAnalysis.experience || "Belum ada pengalaman",
                education: cvDetail.aiAnalysis.education || "-",
                skills: cvDetail.aiAnalysis.extracted_skills || []
              };
            }

            setCvData(newCvData);
            if (newAnalysis) setCvAnalysis(newAnalysis);

            localStorage.setItem("skillalign_cv_cache", JSON.stringify({
              cvData: newCvData,
              cvAnalysis: newAnalysis
            }));
          }
        } else {
          localStorage.removeItem("skillalign_cv_cache");
          setCvData(null); 
          setCvHistory([]);
          setCvAnalysis({ role: "Tidak terdeteksi", experience: "Belum ada pengalaman", education: "-", skills: [] });
        }
      } catch (error) {
        console.error("Gagal memuat data CV:", error);
      } finally {
        setIsFetchingInitial(false);
      }
    };

    fetchLatestCV();
  }, []);

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      toast.info("Mempersiapkan unduhan...");
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Gagal mengambil file");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "Dokumen_CV.pdf"; 
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success("Dokumen berhasil diunduh!");
    } catch (error) {
      console.error("Gagal mengunduh file:", error);
      window.open(fileUrl, '_blank');
    }
  };

  if (isFetchingInitial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (isUploading) {
    return (
      <CVUploadWizard 
        onCancel={() => setIsUploading(false)} 
        hasExistingCv={!!cvData} 
        existingCvId={cvData?.id} 
      />
    );
  }
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-semibold">My CV</h2>
          <p className="text-text-secondary">Manage your resume and view extracted skills.</p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap w-full sm:w-auto gap-3">
          {cvData && (
            <Button 
              variant="outline" 
              className="flex-1 min-w-[120px] sm:flex-none gap-2 cursor-pointer bg-card border-border hover:bg-surface-fill" 
              onClick={() => handleDownload(cvData.fileUrl, cvData.fileName)}
            >
              <Download size={16} />
              Download
            </Button>
          )}
          <Button 
            onClick={() => setIsUploading(true)} 
            className="flex-1 min-w-[120px] sm:flex-none gap-2 cursor-pointer"
          >
            <UploadIcon size={16} />
            {cvData ? "Update CV" : "Upload CV"}
          </Button>
        </div>
      </div>

      {cvData ? (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="p-6 h-full min-h-[500px] flex flex-col items-center justify-center text-center border-dashed border-2 border-border bg-surface-fill/50 rounded-xl">
                <FileText size={48} className="text-text-secondary mb-4 opacity-50" />
                <h3 className="font-medium text-lg mb-2 text-foreground">{cvData.fileName}</h3>
                <p className="text-sm text-text-secondary max-w-sm mb-6">
                  Last updated on {cvData.uploadedAt}. This CV is currently being used for your skill gap analysis and job matching.
                </p>
                <Button variant="outline" className="gap-2 cursor-pointer bg-card border-border hover:bg-surface-fill" onClick={() => window.open(cvData.fileUrl, '_blank')}>
                  <ExternalLink size={16} />
                  View Full PDF
                </Button>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-5 border-border bg-card">
                <h3 className="font-heading font-medium mb-4 text-foreground">Extracted Info</h3>
                <InfoPopup 
                    title="Tentang Ekstraksi CV" 
                    content={
                      <>
                        <p>Informasi di bawah ini diekstrak secara otomatis oleh AI dengan membaca teks dari file PDF Anda (Format <i>Applicant Tracking System / ATS</i>).</p>
                        <p className="mt-2 text-amber-500 font-medium">⚠️ Jika ada informasi yang salah atau tidak terdeteksi:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Mungkin desain CV Anda terlalu rumit (banyak grafis/kolom) sehingga sulit dibaca AI.</li>
                          <li>Gunakan format CV ATS-Friendly (teks lurus standar) untuk hasil terbaik.</li>
                        </ul>
                      </>
                    } 
                  />
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">Current Role</div>
                    <div className="font-medium text-foreground">{cvAnalysis.role}</div>
                  </div>
                  <div>
                    <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">Experience</div>
                    <div className="font-medium text-foreground">{cvAnalysis.experience}</div>
                  </div>
                  <div>
                    <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">Education</div>
                    <div className="font-medium text-foreground truncate">{cvAnalysis.education}</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-5 border-border bg-card">
                <h3 className="font-heading font-medium mb-4 text-foreground">Top Skills Recognized</h3>
                <InfoPopup 
                    title="Bagaimana AI Menemukan Skill Ini?" 
                    content={
                      <>
                        <p>AI memindai dokumen Anda dan membandingkannya dengan miliaran basis data keterampilan global.</p>
                        <p className="mt-2">Skill yang muncul di sini adalah keahlian teknis (<i>hard skills</i>) dan non-teknis (<i>soft skills</i>) dominan yang berhasil diidentifikasi AI dari pengalaman kerja dan deskripsi proyek Anda.</p>
                      </>
                    } 
                  />
                <div className="flex flex-wrap gap-2">
                  {cvAnalysis.skills.length > 0 ? (
                    cvAnalysis.skills.map(skill => (
                      <span key={skill} className="px-2.5 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-medium border border-secondary/20 capitalize">
                        {skill.replace(/_/g, " ")}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-text-secondary italic">Belum ada skill yang terekstrak</span>
                  )}
                </div>
              </Card>
            </div>
          </div>

          <div className="pt-8">
            <h3 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Clock className="w-5 h-5 text-text-secondary" /> CV History
            </h3>

            <Card className="p-6 space-y-4 bg-transparent border-transparent shadow-none px-0">
              {cvHistory.length === 0 ? (
                <p className="text-sm text-text-secondary text-center py-6">Belum ada riwayat CV lama.</p>
              ) : (
                cvHistory.map((cv) => (
                  <HistoryCard
                    key={cv.id}
                    variant="compact"
                    title={cv.fileName}
                    subtitle={`Diunggah pada ${new Date(cv.uploadedAt || cv.createdAt || Date.now()).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`}
                    rightElement={
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-text-secondary hover:text-primary cursor-pointer" onClick={() => handleDownload(cv.fileUrl, cv.fileName)}>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-text-secondary hover:text-rose-500 cursor-pointer" onClick={() => toast.info("Fitur hapus CV akan segera hadir!")}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    }
                  />
                ))
              )}
            </Card>
          </div>
        </>
      ) : (
        <div className="py-20 text-center space-y-6">
          <div className="w-24 h-24 bg-surface-fill rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText size={48} className="text-text-secondary opacity-50" />
          </div>
          <h2 className="text-2xl font-heading font-semibold text-foreground">Profil Karier Anda Masih Kosong</h2>
          <p className="text-text-secondary max-w-lg mx-auto">Klik tombol Upload CV di atas untuk membiarkan AI mengekstrak profil Anda.</p>
        </div>
      )}
    </div>
  );
}
