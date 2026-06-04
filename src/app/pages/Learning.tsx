import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ExternalLink, Loader2, ArrowLeft, RefreshCw, Search } from "lucide-react";
import { ProcessPopup } from "../components/ProcessPopup";
import api from "../lib/axios";
import { toast } from "sonner";

export function Learning() {
  const location = useLocation();
  const navigate = useNavigate();
  const matchId = location.state?.matchId || null;

  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [refreshingSkill, setRefreshingSkill] = useState<string | null>(null);
  const [targetJobTitle, setTargetJobTitle] = useState("");

  const [popupState, setPopupState] = useState<{
    isOpen: boolean;
    type: "loading" | "success" | "error";
    title: string;
    subtitle: string;
  }>({ isOpen: false, type: "loading", title: "", subtitle: "" });

  const handleSearchSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setLearningPaths([]);
    
    try {
      const response = await api.get(`/cv/courses/${encodeURIComponent(searchQuery)}`);
      setLearningPaths(response.data.data);
      toast.success(`Berhasil menemukan materi untuk ${searchQuery}`);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mencari skill tersebut.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleRefreshCourse = async (skillName: string) => {
    setRefreshingSkill(skillName);
    
    // Tampilkan Popup Loading Besar
    setPopupState({
      isOpen: true,
      type: "loading",
      title: "Mencari Alternatif",
      subtitle: `Mencari referensi kursus terbaru untuk ${skillName}...`
    });

    try {
      const response = await api.post('/cv/refresh-course', { skillName });
      const newData = response.data.data;
      
      setLearningPaths(prev => prev.map(item => {
        const currentName = item.skillName || item.coursesData?.skill || item.skill;
        if (currentName.toLowerCase() === skillName.toLowerCase()) {
          return newData; 
        }
        return item;
      }));
      
      // Ubah Popup menjadi Sukses
      setPopupState({
        isOpen: true,
        type: "success",
        title: "Berhasil!",
        subtitle: "Alternatif kursus berhasil ditemukan."
      });
      // Tutup otomatis
      setTimeout(() => setPopupState(prev => ({ ...prev, isOpen: false })), 1500);

    } catch (error) {
      console.error("Gagal mencari kursus:", error);
      // Ubah Popup menjadi Error
      setPopupState({
        isOpen: true,
        type: "error",
        title: "Pencarian Gagal",
        subtitle: "Gagal mencari alternatif kursus saat ini."
      });
      setTimeout(() => setPopupState(prev => ({ ...prev, isOpen: false })), 2000);

    } finally {
      setRefreshingSkill(null);
    }
  };
  
  useEffect(() => {
    if (!matchId) {
      setIsLoading(false);
      return;
    }

  const fetchPaths = async () => {
      try {
        const response = await api.get(`/match/${matchId}`);
        const detailData = response.data.data;
        const rawPaths = detailData?.learningPaths || detailData?.learningPath || [];
        setLearningPaths(rawPaths);

        const jobTitleReal = 
          detailData?.jobPosting?.title || 
          detailData?.job?.title || 
          detailData?.title || 
          "Target Pekerjaan";
          
        setTargetJobTitle(jobTitleReal);

      } catch (error) {
        console.error("Gagal memuat learning path:", error);
        toast.error("Gagal memuat rekomendasi pembelajaran.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaths();
  }, [matchId]);

  if (!matchId && learningPaths.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 max-w-2xl mx-auto animate-in fade-in">
        <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
          <Search className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-foreground mb-3 text-center">
          Apa yang ingin kamu pelajari?
        </h2>
        <p className="mb-8 text-center text-text-secondary text-lg">
          Ketik skill apa saja (contoh: Docker, Figma, Python) dan AI kami akan mencarikan jalur belajarnya untukmu.
        </p>

        {/* Form Pencarian */}
        <form onSubmit={handleSearchSkill} className="w-full relative flex items-center">
          <input
            type="text"
            placeholder="Ketik nama skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-32 py-4 bg-surface-fill border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-2xl outline-none transition-all text-foreground text-lg shadow-sm"
          />
          <Button 
            type="submit" 
            disabled={!searchQuery.trim() || isSearching}
            className="absolute right-2 top-2 bottom-2 rounded-xl px-6 cursor-pointer"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Cari Kursus"}
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <span className="text-sm text-text-secondary mt-1 mr-2">Pencarian populer:</span>
          {["React", "PostgreSQL", "UI/UX", "Machine Learning"].map(tag => (
            <button 
              key={tag} 
              type="button"
              onClick={() => {
                setSearchQuery(tag);
                const formEvent = { preventDefault: () => {} } as React.FormEvent;
                setTimeout(() => handleSearchSkill(formEvent), 0);
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-surface-fill border border-border hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading || isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-40 max-w-4xl mx-auto animate-in fade-in">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-text-secondary">
          {isSearching ? `Mencari materi terbaik untuk ${searchQuery}...` : "Menyusun jalur belajarmu..."}
        </p>
      </div>
    );
  }

  return (
    <>
      <ProcessPopup {...popupState} />
      <div className="max-w-4xl mx-auto space-y-6 pb-10 animate-in fade-in duration-500">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-heading font-semibold">Your Learning Path</h2>
            <p className="text-text-secondary">Prioritized recommendations to close your skill gaps.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)} 
            className="cursor-pointer bg-surface-fill border-transparent hover:bg-surface-fill/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
        </div>

        {learningPaths.length === 0 ? (
          <Card className="p-10 text-center flex flex-col items-center border-transparent bg-surface-fill/50 mt-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">Tidak Ada Skill Gap!</h3>
            <p className="text-text-secondary max-w-md mx-auto">
              Kualifikasi Anda sudah sangat sesuai dengan lowongan ini. Tidak ada materi pembelajaran tambahan yang mendesak.
            </p>
          </Card>
        ) : (
          <div className="relative mt-12 space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {learningPaths.map((dbRow, i) => {
              
              const pathData = dbRow.coursesData || dbRow;
              
              let topCourse = pathData.courses?.[0] || pathData.youtube_resources?.[0];
              let isVideo = !!pathData.youtube_resources?.[0] && !pathData.courses?.[0];
              let platform = topCourse?.provider || topCourse?.channel;

              if (!topCourse && pathData.resources && pathData.resources.length > 0) {
                topCourse = pathData.resources[0];
                isVideo = topCourse.type === "free";
                platform = topCourse.type === "course" ? "Coursera (Auto-Search)" : "Web Search";
              }
              
              const skillName = dbRow.skillName || pathData.skillName || pathData.skill || "Skill";
              const title = topCourse?.title || `Fundamental ${skillName}`;
              platform = platform || "Pencarian Mandiri";
              const duration = pathData.estimated_duration || "Fleksibel";
              const difficulty = topCourse?.level || "Beginner";
              
              const fallbackYoutube = `https://www.youtube.com/results?search_query=tutorial+belajar+${encodeURIComponent(skillName)}`;
              const targetUrl = topCourse?.url || fallbackYoutube;
              
              let priorityLabel = "Nice to have";
              let priorityColor = "bg-surface-fill text-text-secondary shadow-surface-fill";
              let priorityTextClass = "text-text-secondary";
              let priorityBgClass = "bg-surface-fill";
              
              const priorityScore = pathData.priority || (i + 1);
              
              if (priorityScore === 1) {
                priorityLabel = "Critical";
                priorityColor = "bg-primary text-white shadow-primary/20";
                priorityTextClass = "text-primary";
                priorityBgClass = "bg-primary/10";
              } else if (priorityScore === 2) {
                priorityLabel = "Important";
                priorityColor = "bg-warning text-white shadow-warning/20";
                priorityTextClass = "text-warning";
                priorityBgClass = "bg-warning/10";
              }

              return (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pt-2">
                  
                  {/* Timeline Dot di Tengah */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_2px_var(--color-border)] z-10 transition-colors duration-300 ${priorityColor}`}>
                    {i + 1}
                  </div>
                  
                  {/* Card Konten di Kiri/Kanan */}
                  <Card className="p-5 md:p-6 w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md bg-card">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md ${priorityBgClass} ${priorityTextClass}`}>
                        {priorityLabel}
                      </div>
                      <div className="text-xs font-mono text-text-secondary flex items-center gap-2">
                        <span>{duration}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="capitalize">{difficulty}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-heading font-semibold mb-1 line-clamp-2 leading-tight">
                      {title}
                    </h3>

                    <button 
                        onClick={() => handleRefreshCourse(skillName)}
                        disabled={refreshingSkill === skillName}
                        className="shrink-0 p-1.5 rounded-md hover:bg-primary/10 text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
                        title="Cari Alternatif Kursus"
                      >
                        <RefreshCw size={16} className={refreshingSkill === skillName ? "animate-spin text-primary" : ""} />
                      </button>
                    
                    <div className="text-sm flex items-center gap-1.5 text-foreground mb-5 font-medium">
                      <span className={isVideo ? "text-red-500" : "text-blue-500"}>
                        {isVideo ? "▶" : "📚"}
                      </span>
                      {platform}
                    </div>
                    
                    <div className="text-sm text-text-secondary mb-6 bg-surface-fill/50 p-3.5 rounded-lg border border-border/50 leading-relaxed">
                      <span className="text-lg leading-none mr-1.5">💡</span> 
                      <span className="font-semibold text-foreground">Why:</span> Dirancang khusus untuk menutupi kelemahan <span className="uppercase font-bold text-foreground">{skillName}</span> pada target pekerjaan ini.
                    </div>
                    
                    <Button 
                      variant="secondary" 
                      className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:border-primary cursor-pointer border-transparent bg-surface-fill"
                      onClick={() => window.open(targetUrl, "_blank")}
                      disabled={targetUrl === "#"}
                    >
                      {targetUrl === "#" ? "Link Tidak Tersedia" : "Start Learning"}
                      <ExternalLink size={16} className="ml-2 opacity-50 group-hover:opacity-100" />
                    </Button>
                  </Card>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
