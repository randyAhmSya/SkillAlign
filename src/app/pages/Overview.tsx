import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { Card } from "../components/ui/card";
import { ScoreRing } from "../components/ScoreRing";
import { RadarChart } from "../components/RadarChart";
import { SkillPill } from "../components/SkillPill";
import { Button } from "../components/ui/button";
import { Loader2, ChevronLeft, ChevronRight, ArrowLeft, Clock } from "lucide-react";
import { HistoryCard } from "../components/HistoryCard"; 
import api from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";

const OVERVIEW_CACHE = {
  history: null as any[] | null,
  historyPage: 1,
  historyTotalPages: 1,
  matchDetails: {} as Record<string, any> 
};

export function Overview() {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const activeMatchId = location.state?.matchId || null;

  const [history, setHistory] = useState<any[]>(OVERVIEW_CACHE.history || []);
  const [historyPage, setHistoryPage] = useState(OVERVIEW_CACHE.historyPage);
  const [historyTotalPages, setHistoryTotalPages] = useState(OVERVIEW_CACHE.historyTotalPages);
  const [isHistoryLoading, setIsHistoryLoading] = useState(!OVERVIEW_CACHE.history);

  const [matchDetail, setMatchDetail] = useState<any>(
    activeMatchId ? OVERVIEW_CACHE.matchDetails[activeMatchId] || null : null
  );
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  
  const fromNewAnalysis = location.state?.fromNewAnalysis || false;

  useEffect(() => {
    const fetchHistory = async () => {
      // Tampilkan cache langsung agar UI terasa instan
      if (OVERVIEW_CACHE.history && OVERVIEW_CACHE.historyPage === historyPage && !fromNewAnalysis) {
        setHistory(OVERVIEW_CACHE.history);
        setHistoryTotalPages(OVERVIEW_CACHE.historyTotalPages);
      } else {
        setIsHistoryLoading(true);
      }

      try {
        // Ambil data terbaru dari backend secara diam-diam
        const response = await api.get(`/match/history`, {
          params: { page: historyPage, limit: 5 }
        });
        
        const historyData = response.data.data;
        
        // Timpa data di layar dengan data yang paling fresh
        setHistory(historyData);
        setHistoryTotalPages(response.data.meta.totalPages);

        OVERVIEW_CACHE.history = historyData;
        OVERVIEW_CACHE.historyPage = historyPage;
        OVERVIEW_CACHE.historyTotalPages = response.data.meta.totalPages;

        if (fromNewAnalysis) {
          navigate('.', { state: { matchId: activeMatchId }, replace: true });
        }

      } catch (error) {
        console.error("Gagal memuat history:", error);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [historyPage, fromNewAnalysis]); 

  useEffect(() => {
    if (!activeMatchId) {
      setMatchDetail(null);
      return;
    }

    const fetchMatchDetail = async () => {
      // Tampilkan cache langsung agar grafik langsung muncul
      if (OVERVIEW_CACHE.matchDetails[activeMatchId]) {
        setMatchDetail(OVERVIEW_CACHE.matchDetails[activeMatchId]);
      } else {
        setIsDetailLoading(true);
      }

      try {
        // Tarik data terbaru dari backend
        const response = await api.get(`/match/${activeMatchId}`);
        const detailData = response.data.data;
        
        // Update layar dan cache dengan data hasil Analisis Ulang!
        setMatchDetail(detailData);
        OVERVIEW_CACHE.matchDetails[activeMatchId] = detailData; 
      } catch (error: any) {
        console.error("Gagal memuat detail match:", error);
        toast.error("Gagal memuat detail analisis.");
      } finally {
        setIsDetailLoading(false);
      }
    };

    fetchMatchDetail();
  }, [activeMatchId]); 

  const handleGoBack = () => {
    navigate('.', { state: {}, replace: true }); 
  };

  const handleSelectHistory = (id: string) => {
    navigate('.', { state: { matchId: id }, replace: true }); 
  };

  const firstName = user?.name?.split(' ')[0] || "John";

  if (activeMatchId) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-10 animate-in fade-in duration-300">
        
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-heading font-semibold">Analysis Result</h2>
            <p className="text-text-secondary">Detail kecocokan profilmu dengan lowongan ini.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-2 cursor-pointer bg-surface-fill border-transparent hover:bg-surface-fill/80"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Button>
        </div>

        {isDetailLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-text-secondary">Loading AI Analysis...</p>
          </div>
        ) : matchDetail ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-surface-fill border-transparent p-4 sm:p-5 flex flex-col justify-between">
                <span className="text-sm font-medium text-text-secondary mb-2">Overall Match</span>
                <span className="text-3xl font-mono text-primary font-semibold">
                  {Math.round(matchDetail.matchScore)}%
                </span>
              </Card>
              <Card className="bg-surface-fill border-transparent p-4 sm:p-5 flex flex-col justify-between">
                <span className="text-sm font-medium text-text-secondary mb-2">Skills Matched</span>
                <span className="text-3xl font-mono text-foreground font-semibold">
                  {matchDetail?.skillGapJson?.present?.length || 0}
                </span>
              </Card>
              <Card className="bg-surface-fill border-transparent p-4 sm:p-5 flex flex-col justify-between">
                <span className="text-sm font-medium text-text-secondary mb-2">Skill Gaps</span>
                <span className="text-3xl font-mono text-foreground font-semibold">
                  {matchDetail?.skillGapJson?.missing?.length || 0}
                </span>
              </Card>
              <Card className="bg-surface-fill border-transparent p-4 sm:p-5 flex flex-col justify-between">
                <span className="text-sm font-medium text-text-secondary mb-2">Learning Paths</span>
                <span className="text-3xl font-mono text-foreground font-semibold">
                  {matchDetail?.learningPath?.length || 0}
                </span>
              </Card>
            </div>

            <div className="grid md:grid-cols-5 gap-6">
              {/* Kolom Kiri: Detail AI */}
              <div className="md:col-span-3 space-y-6">
                <Card className="h-full">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="text-sm text-text-secondary mb-1">Target Role</div>
                        <h3 className="text-xl font-heading font-semibold">{matchDetail.jobPosting?.title}</h3>
                        <div className="text-sm text-text-secondary mt-1">
                          {matchDetail.jobPosting?.company?.companyName}
                        </div>
                      </div>
                      <ScoreRing score={Math.round(matchDetail.matchScore)} size="md" />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Matched Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {matchDetail.skillGapJson?.present?.map((skill: string, idx: number) => (
                            <SkillPill key={idx} label={skill} status="matched" />
                          ))}
                          {(!matchDetail.skillGapJson?.present || matchDetail.skillGapJson.present.length === 0) && (
                            <span className="text-sm text-text-secondary">Tidak ada skill yang cocok.</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-3 mt-6">Missing Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {matchDetail.skillGapJson?.missing?.map((skill: string, idx: number) => (
                            <SkillPill key={idx} label={skill} status="missing" />
                          ))}
                          {(!matchDetail.skillGapJson?.missing || matchDetail.skillGapJson.missing.length === 0) && (
                            <span className="text-sm text-emerald-500">Hebat! Tidak ada skill yang kurang.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Kolom Kanan: Top Matches */}
              <div className="md:col-span-2 space-y-6">
                <Card className="h-full flex flex-col">
                  <div className="flex justify-between items-center p-6 pb-2">
                    <div>
                      <h3 className="font-heading font-semibold text-lg">Learning Path</h3>
                      <p className="text-xs text-text-secondary mt-1">Rekomendasi untuk menutup skill gap</p>
                    </div>
                    {/* Tombol View all mengarah ke tab Learning Path membawa ID */}
                    <button 
                      onClick={() => navigate('/dashboard/learning', { state: { matchId: activeMatchId } })}
                      className="text-sm text-primary hover:underline cursor-pointer"
                    >
                      View detail
                    </button>
                  </div>
                  
                  <div className="p-6 pt-4 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                    {(() => {
                      const lpArray = matchDetail?.learningPaths || matchDetail?.learningPath || [];
                      
                      if (lpArray.length > 0) {
                        return lpArray.slice(0, 4).map((dbRow: any, i: number) => {
                          
                          const pathData = dbRow.coursesData || dbRow;
                          
                          const topCourse = pathData.courses?.[0] || pathData.youtube_resources?.[0];
                          const isVideo = !!pathData.youtube_resources?.[0] && !pathData.courses?.[0];
                          
                          const displaySkillName = dbRow.skillName || pathData.skill || "Unknown Skill";

                          return (
                            <div 
                              key={i} 
                              onClick={() => navigate('/dashboard/learning-path', { state: { matchId: activeMatchId } })}
                              className="group flex flex-col gap-1 p-4 rounded-xl bg-surface-fill/30 hover:bg-surface-fill border border-transparent hover:border-primary/20 transition-all cursor-pointer"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1 uppercase">
                                  {displaySkillName}
                                </span>
                                <span className="text-xs font-mono text-text-secondary whitespace-nowrap bg-background px-2 py-0.5 rounded-full border border-border">
                                  {pathData.estimated_duration || "Fleksibel"}
                                </span>
                              </div>
                              
                              {topCourse && (
                                <div className="text-xs text-text-secondary line-clamp-1 mt-1 flex items-center gap-1.5">
                                  <span className={isVideo ? "text-red-500" : "text-blue-500"}>
                                    {isVideo ? "▶" : "📚"}
                                  </span>
                                  {topCourse.provider || topCourse.channel} • {topCourse.title}
                                </div>
                              )}
                              {!topCourse && (
                                <div className="text-xs text-text-secondary line-clamp-1 mt-1 italic">
                                  Sedang menyiapkan rekomendasi...
                                </div>
                              )}
                            </div>
                          );
                        });
                      } else {
                        return (
                          <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-70">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                              <span className="text-xl">✨</span>
                            </div>
                            <p className="text-sm font-medium text-foreground">Skill Anda Sudah Memadai</p>
                            <p className="text-xs text-text-secondary mt-1">Tidak ada rekomendasi kursus yang<br/>diperlukan untuk lowongan ini.</p>
                          </div>
                        );
                      }
                    })()}
                  </div>        
                </Card>
              </div>     
            </div>

            {/* Radar Chart Section */}
            {/* {matchDetail?.radarChartData && matchDetail.radarChartData.length > 0 && (
              <Card className="p-6">
                <h3 className="font-heading font-semibold mb-6">Your Skill Profile vs Industry Demand</h3>
                <div className="h-[400px] w-full">
                  <RadarChart data={matchDetail.radarChartData} userKey="user" industryKey="industry" />
                </div>
              </Card>
            )} */}

            {/* Rekomendasi Kursus / Learning Path tambahan bisa ditaruh di sini nanti */}
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-2xl font-heading font-semibold">Good morning, {firstName}</h2>
        <p className="text-text-secondary">Here's your career intelligence summary for today.</p>
      </div>

      <Card className="flex flex-col h-[600px]">
        <div className="p-6 border-b border-border flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-semibold text-lg">Analysis History</h3>
        </div>
        
        <div className="p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
          {isHistoryLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-text-secondary mb-4" />
              <p className="text-text-secondary">Memuat riwayat...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-20 text-text-secondary">
              <p>Belum ada riwayat analisis AI.</p>
              <p className="text-sm mt-1">Coba ke halaman Job Matches dan analisis sebuah lowongan.</p>
            </div>
          ) : (
            history.map((item) => {
              const score = Math.round(item.matchScore);
              const formattedDate = new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
              
              return (
                <HistoryCard
                  key={item.id}
                  variant="default"
                  onClick={() => handleSelectHistory(item.id)}
                  title={item.jobPosting?.title}
                  subtitle={`${item.jobPosting?.company?.companyName || "Perusahaan Anonim"} • ${formattedDate}`}
                  rightElement={
                    <>
                      <div className="h-2 w-full md:w-32 bg-surface-fill rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${score}%` }} />
                      </div>
                      <span className={`font-mono font-bold text-lg w-12 text-right ${score >= 70 ? 'text-emerald-500' : score >= 40 ? 'text-yellow-500' : 'text-rose-500'}`}>
                        {score}%
                      </span>
                    </>
                  }
                />
              );
            })
          )}
        </div>

        {historyTotalPages > 1 && (
          <div className="p-4 border-t border-border flex justify-between items-center bg-surface-fill/20 rounded-b-xl">
            <Button variant="outline" size="sm" onClick={() => setHistoryPage(p => Math.max(1, p - 1))} disabled={historyPage === 1} className="cursor-pointer bg-card border-transparent">
              <ChevronLeft className="w-4 h-4 mr-2" /> Prev
            </Button>
            <span className="text-sm font-medium text-text-secondary">Halaman {historyPage} dari {historyTotalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setHistoryPage(p => Math.min(historyTotalPages, p + 1))} disabled={historyPage === historyTotalPages} className="cursor-pointer bg-card border-transparent">
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </Card>
      
    </div>
  );
}
