import { useState, ReactNode, useEffect } from "react";
import { Info, X } from "lucide-react";

interface InfoPopupProps {
  title: string;
  content: ReactNode;
  trigger?: ReactNode; // Bisa kustom tombol, default-nya ikon 'Info'
}

export function InfoPopup({ title, content, trigger }: InfoPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Mencegah scroll pada body saat popup terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Tombol Pemicu (Trigger) */}
      <div 
        className="inline-flex items-center justify-center cursor-pointer ml-1.5" 
        onClick={() => setIsOpen(true)}
        title="Klik untuk info lebih lanjut"
      >
        {trigger || (
          <Info className="w-4 h-4 text-text-secondary hover:text-primary transition-colors" />
        )}
      </div>

      {/* Latar Belakang Gelap (Backdrop) & Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 p-4"
          onClick={() => setIsOpen(false)} // Tutup jika klik di luar kotak
        >
          {/* Kotak Popup */}
          <div 
            className="bg-card border border-border shadow-xl rounded-xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Mencegah tertutup jika kotak dalam diklik
          >
            {/* Header Popup */}
            <div className="flex justify-between items-start mb-4 gap-4">
              <h3 className="text-lg font-heading font-semibold text-foreground leading-tight">
                {title}
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-rose-500 transition-colors p-1 bg-surface-fill/50 rounded-md hover:bg-rose-500/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Isi Konten Popup */}
            <div className="text-sm text-text-secondary leading-relaxed space-y-3">
              {content}
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
