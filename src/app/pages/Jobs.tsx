import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, MapPin, SlidersHorizontal, BookmarkPlus, Loader2, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { SkillPill } from "../components/SkillPill";
import api from "../lib/axios"; 
import { toast } from "sonner"; 

const CACHE = {
  normalJobs: null as any[] | null,
  aiJobs: null as any[] | null, 
  page: 1,
  totalPages: 1,
  search: "",
  location: "",
  cvId: null as string | null
};

export function Jobs() {
  const navigate = useNavigate();

  const [isAIMode, setIsAIMode] = useState(true);

  const [aiJobs, setAiJobs] = useState<any[]>(CACHE.aiJobs || []);
  const [normalJobs, setNormalJobs] = useState<any[]>(CACHE.normalJobs || []);

  const [isLoading, setIsLoading] = useState(true); 
  const [cvId, setCvId] = useState<string | null>(CACHE.cvId);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null); 
  
  const [page, setPage] = useState(CACHE.page);
  const [totalPages, setTotalPages] = useState(CACHE.totalPages);
  const limit = 10; 

  const [searchTerm, setSearchTerm] = useState(CACHE.search);
  const [locationTerm, setLocationTerm] = useState(CACHE.location);
  const [debouncedSearch, setDebouncedSearch] = useState(CACHE.search);
  const [debouncedLocation, setDebouncedLocation] = useState(CACHE.location);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setDebouncedLocation(locationTerm);
      if (searchTerm !== CACHE.search || locationTerm !== CACHE.location) {
        setPage(1); 
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, locationTerm]);

  useEffect(() => {
    const fetchJobsData = async () => {
      setIsLoading(true); 
      try {
        if (isAIMode) {
          // if (CACHE.aiJobs && CACHE.aiJobs.length > 0) {
          //   setAiJobs(CACHE.aiJobs); 
          //   setIsLoading(false);
          //   return;
          // }

          const response = await api.get("/match/recommendations/jobs");
          const rawAiData = response.data.data || [];
          
          const mappedAiJobs = rawAiData.map((match: any, index: number) => ({
            id: match.jobPostingId || match.id,
            matchId: match.id,
            rank: index + 1,
            title: match.jobPosting?.title || "Posisi Tidak Diketahui",
            companyName: match.jobPosting?.company?.companyName || "Perusahaan Anonim",
            industry: "Rekomendasi AI",
            isAnalyzed: true, 
            score: match.matchScore ? Math.round(match.matchScore) : 0, 
            description: `[Rank #${index + 1}] ${match.aiSummary} - Pekerjaan ini disarankan oleh AI berdasarkan profil CV Anda.`,
            matchedSkills: [], 
            missingSkills: []
          }));

          setAiJobs(mappedAiJobs); 
          CACHE.aiJobs = mappedAiJobs;

        } else {
          const response = await api.get(`/jobs/matches`, {
            params: {
              page: page,
              limit: limit,
              search: debouncedSearch,
              location: debouncedLocation
            }
          });
          
          const fetchedData = response.data.data || [];
          setNormalJobs(fetchedData); 

          const currentCvId = response.data.meta?.cvId || null;
          setCvId(currentCvId);

          CACHE.normalJobs = fetchedData;
          CACHE.page = page;
          CACHE.search = debouncedSearch;
          CACHE.location = debouncedLocation;
          CACHE.cvId = currentCvId;
          if (response.data.meta?.totalPages) {
            setTotalPages(response.data.meta.totalPages);
            CACHE.totalPages = response.data.meta.totalPages;
          }
        }
      } catch (error) {
        console.error("Gagal memuat data pekerjaan:", error);
        toast.error("Gagal memuat daftar pekerjaan");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobsData();
  }, [isAIMode, page, debouncedSearch, debouncedLocation]); 

  const handleAnalyzeClick = async (jobId: string | number) => {
    if (!cvId) {
      toast.error("CV tidak ditemukan. Harap upload CV terlebih dahulu.");
      return;
    }
    setAnalyzingId(jobId.toString());
    toast.info("AI sedang menganalisis kecocokanmu...");
    try {
      const response = await api.post("/cv/analyze", {
        cvUploadId: cvId,
        jobPostingId: jobId
      });
      const resultId = response.data.data.matchResultId;
      toast.success("Analisis selesai!");
      navigate(`/dashboard?matchId=${resultId}`);
    } catch (error: any) {
      console.error("AI Analysis error:", error);
      toast.error(error.response?.data?.message || "AI gagal menganalisis lowongan ini.");
    } finally {
      setAnalyzingId(null);
    }
  };

  const displayedJobs = isAIMode ? aiJobs : normalJobs;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-heading font-semibold">Eksplorasi Pekerjaan</h2>
          <p className="text-text-secondary">Temukan karir yang paling tepat untuk Anda.</p>
        </div>

        <div className="flex bg-surface-fill p-1 rounded-xl border border-border shadow-sm">
          <button 
            onClick={() => setIsAIMode(true)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              isAIMode 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-text-secondary hover:text-foreground hover:bg-card/50"
            }`}
          >
            <Sparkles size={16} className={isAIMode ? "text-primary-foreground" : "text-primary"} />
            Rekomendasi AI
          </button>
          <button 
            onClick={() => setIsAIMode(false)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              !isAIMode 
                ? "bg-card text-foreground shadow-md border border-border/50" 
                : "text-text-secondary hover:text-foreground hover:bg-card/50"
            }`}
          >
            Semua Pekerjaan
          </button>
        </div>
      </div>

      {!isAIMode && (
        <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm animate-in slide-in-from-top-2 duration-300">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-none bg-surface-fill focus-visible:ring-0" 
              placeholder="Search job title..." 
            />
          </div>
          <div className="w-px bg-border hidden md:block" />
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
            <Input 
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              className="pl-10 border-none bg-surface-fill focus-visible:ring-0" 
              placeholder="Location or Remote" 
            />
          </div>
          <div className="w-px bg-border hidden md:block" />
          <Button variant="outline" className="gap-2 shrink-0 cursor-pointer">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </div>
      )}
      
      {/* ✅ Diperbaiki: jobs.length diganti menjadi displayedJobs.length */}
      {isLoading && displayedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
          <p>{isAIMode ? "Menyusun rekomendasi terbaik dari AI..." : "Mencari lowongan pekerjaan..."}</p>
        </div>
      ) : displayedJobs.length === 0 ? (
        <div className="text-center py-20 text-text-secondary bg-card rounded-xl border border-border flex flex-col items-center">
          <Sparkles className="w-12 h-12 mb-4 opacity-20" />
          <p>{isAIMode ? "Belum ada rekomendasi. Pastikan Anda sudah mengatur target pekerjaan di menu My CV." : "Belum ada rekomendasi pekerjaan yang sesuai dengan pencarian Anda."}</p>
        </div>
      ) : (        
         <>
          <div className={`grid md:grid-cols-2 gap-6 transition-opacity duration-300 ${isLoading ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
            {/* ✅ Diperbaiki: jobs.map diganti menjadi displayedJobs.map */}
            {displayedJobs.map((job) => {
              const requiredSkills = [...(job.matchedSkills || []), ...(job.missingSkills || [])];
              
              let scoreColor = "border-border text-text-secondary";
              if (job.isAnalyzed) {
                if (job.score >= 70) scoreColor = "border-emerald-500 text-emerald-500 bg-emerald-500/10";
                else if (job.score >= 40) scoreColor = "border-yellow-500 text-yellow-500 bg-yellow-500/10";
                else scoreColor = "border-rose-500 text-rose-500 bg-rose-500/10";
              }

              return (
                <Card key={job.id} className="flex flex-col hover:border-primary/30 transition-all group p-6 shadow-sm">
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="min-w-0 flex-1 pr-4">
                      <h3 className="text-lg font-heading font-semibold group-hover:text-primary transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      
                      <div className="text-sm text-text-secondary mt-1 truncate">
                        {job.companyName} &bull; {job.industry || "Remote"}
                      </div>

                      <div className="text-sm font-medium mt-1">{job.salary}</div>
                    </div>
                    
                    <div className="shrink-0 flex flex-col items-center gap-2">
                      {job.isAnalyzed ? (
                        <div 
                          className={`w-10 h-10 rounded-full border-[3px] flex items-center justify-center font-bold ${scoreColor}`} 
                          title="Telah dianalisis AI"
                        >
                          <span className="text-[11px]">{job.score}%</span>
                        </div>
                      ) : (
                        <div 
                          className="w-10 h-10 rounded-full border-[3px] border-border border-dashed flex items-center justify-center bg-surface-fill/30"
                          title="Skor akan muncul setelah dianalisis AI"
                        >
                          <span className="text-text-secondary text-[10px] font-medium opacity-50">?</span>
                        </div>
                      )}
                      
                      <button className="text-text-secondary hover:text-primary transition-colors cursor-pointer mt-1">
                        <BookmarkPlus size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 mb-6">
                    <div className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
                      {job.description || "Deskripsi pekerjaan tidak tersedia. Silakan klik Analyze this job untuk melihat detail."}
                    </div>

                    {requiredSkills.length > 0 && (
                      <div className="pt-2">
                        <div className="text-xs font-medium text-text-secondary mb-2">Required Skills</div>
                        <div className="flex flex-wrap gap-2">
                          {requiredSkills.map((s, idx) => (
                            <SkillPill key={idx} label={s} status="matched" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {job.isAnalyzed ? (
                    <div className="flex gap-2 w-full">
                      <Button 
                        className="flex-1 cursor-pointer border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300" 
                        variant="outline"
                        onClick={() => navigate(`/dashboard?matchId=${job.matchId}`)}
                      >
                        Lihat Hasil Analisis
                      </Button>
                      
                      {!isAIMode && (
                        <Button 
                          className="cursor-pointer bg-surface-fill hover:bg-surface-fill/80 text-text-secondary px-4 transition-colors" 
                          variant="secondary"
                          title="Analisis Ulang dengan CV Saat Ini"
                          onClick={() => handleAnalyzeClick(job.id)}
                          disabled={analyzingId === job.id.toString()}
                        >
                          {analyzingId === job.id.toString() ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Analisis Ulang"
                          )}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button 
                      className="w-full cursor-pointer" 
                      variant="secondary"
                      onClick={() => handleAnalyzeClick(job.id)}
                      disabled={analyzingId === job.id.toString()}
                    >
                      {analyzingId === job.id.toString() ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {analyzingId === job.id.toString() ? "Analyzing..." : "Analyze this job"}
                    </Button>
                  )}

                </Card>
              );
            })}      
          </div>

          {!isAIMode && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 pt-4">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Sebelumnya
              </Button>
              
              <span className="text-sm font-medium text-text-secondary">
                Halaman {page} dari {totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
                className="cursor-pointer"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
