import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface ProcessPopupProps {
  isOpen: boolean;
  type: "loading" | "success" | "error";
  title: string;
  subtitle: string;
}

export function ProcessPopup({ isOpen, type, title, subtitle }: ProcessPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-card border border-border shadow-2xl rounded-2xl p-8 flex flex-col items-center max-w-sm w-full mx-4 text-center animate-in zoom-in-95 duration-300">
        
        {/* Ikon Dinamis berdasarkan Tipe */}
        {type === "loading" && (
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
        )}
        {type === "success" && (
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
        )}
        {type === "error" && (
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
            <XCircle className="w-8 h-8 text-rose-500" />
          </div>
        )}

        {/* Teks */}
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
