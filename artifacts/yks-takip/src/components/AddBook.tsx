import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddBookProps {
  onAdd: (name: string, total: number, current: number) => void;
}

export function AddBook({ onAdd }: AddBookProps) {
  const [name, setName] = useState("");
  const [totalStr, setTotalStr] = useState("");
  const [currentStr, setCurrentStr] = useState("");
  
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const n = name.trim();
    const t = parseInt(totalStr, 10);
    const c = parseInt(currentStr || "0", 10); // current can be 0 initially

    if (!n) {
      setError("Kitap adı zorunludur.");
      return;
    }
    if (isNaN(t) || t <= 0) {
      setError("Toplam sayfa geçerli bir sayı olmalıdır.");
      return;
    }
    if (isNaN(c) || c < 0) {
      setError("Şu anki sayfa geçerli bir sayı olmalıdır.");
      return;
    }
    if (c > t) {
      setError("Şu anki sayfa, toplam sayfadan büyük olamaz.");
      return;
    }

    onAdd(n, t, c);
    
    // Reset
    setName("");
    setTotalStr("");
    setCurrentStr("");
  };

  const handleNumericInput = (val: string, setter: (v: string) => void) => {
    // Only allow numbers
    if (val === "" || /^[0-9]+$/.test(val)) {
      setter(val);
    }
  };

  return (
    <div className="bg-white border-2 border-border/60 rounded-2xl p-6 mb-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/20 transition-colors duration-300">
      <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-primary" />
        Yeni Kitap Ekle
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <input
            type="text"
            placeholder="Kitap Adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="sleek-input text-lg font-medium placeholder:font-normal"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Toplam Sayfa"
              value={totalStr}
              onChange={(e) => handleNumericInput(e.target.value, setTotalStr)}
              className="sleek-input"
            />
          </div>
          <div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Şu Anki Sayfa"
              value={currentStr}
              onChange={(e) => handleNumericInput(e.target.value, setCurrentStr)}
              className="sleek-input"
            />
          </div>
        </div>

        {error && (
          <p className="text-danger text-sm font-medium animate-in fade-in slide-in-from-top-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3.5 px-6 bg-primary text-primary-foreground font-semibold rounded-xl
                     hover:bg-primary-light hover:-translate-y-0.5 active:translate-y-0
                     shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30
                     transition-all duration-200 ease-out flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Kitap Ekle
        </button>
      </form>
    </div>
  );
}
