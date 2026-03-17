import { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import type { Book } from "@/hooks/use-books";
import { cn } from "@/lib/utils";

interface ActiveBookItemProps {
  book: Book;
  onUpdate: (id: string, updates: Partial<Book>) => void;
  onDelete: (id: string) => void;
}

export function ActiveBookItem({ book, onUpdate, onDelete }: ActiveBookItemProps) {
  const [name, setName] = useState(book.name);
  const [current, setCurrent] = useState(book.currentPage.toString());
  const [total, setTotal] = useState(book.totalPages.toString());
  
  const percentage = book.totalPages > 0 ? (book.currentPage / book.totalPages) * 100 : 0;
  const isHigh = percentage >= 80;

  // Sync local state if external book changes (unlikely in simple flow, but good practice)
  useEffect(() => {
    setName(book.name);
    setCurrent(book.currentPage.toString());
    setTotal(book.totalPages.toString());
  }, [book.name, book.currentPage, book.totalPages]);

  const handleBlur = () => {
    let newCurrent = parseInt(current, 10);
    let newTotal = parseInt(total, 10);
    const newName = name.trim() || "İsimsiz Kitap";

    // Validation
    if (isNaN(newTotal) || newTotal <= 0) newTotal = book.totalPages;
    if (isNaN(newCurrent) || newCurrent < 0) newCurrent = book.currentPage;
    if (newCurrent > newTotal) newCurrent = newTotal;

    // Update local state to validated values
    setName(newName);
    setCurrent(newCurrent.toString());
    setTotal(newTotal.toString());

    // Only fire update if something actually changed
    if (
      newName !== book.name ||
      newCurrent !== book.currentPage ||
      newTotal !== book.totalPages
    ) {
      onUpdate(book.id, {
        name: newName,
        currentPage: newCurrent,
        totalPages: newTotal,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      (e.target as HTMLElement).blur();
    }
  };

  const handleNumericInput = (val: string, setter: (v: string) => void) => {
    if (val === "" || /^[0-9]+$/.test(val)) {
      setter(val);
    }
  };

  return (
    <div className="group relative flex items-center justify-between p-4 bg-white border border-border/50 rounded-xl hover:border-border hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-200">
      
      <div className="flex-1 min-w-0 pr-4">
        {/* Name Input */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full font-bold text-lg text-foreground bg-transparent border-b border-transparent focus:border-border hover:border-border/50 focus:outline-none transition-colors px-1 py-0.5 truncate"
          title={name}
        />
        
        {/* Pages Inputs */}
        <div className="flex items-center text-muted-foreground mt-1 px-1">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={current}
            onChange={(e) => handleNumericInput(e.target.value, setCurrent)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-12 text-center bg-transparent border-b border-transparent focus:border-border hover:border-border/50 focus:outline-none transition-colors"
          />
          <span className="mx-1">/</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={total}
            onChange={(e) => handleNumericInput(e.target.value, setTotal)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-12 text-center bg-transparent border-b border-transparent focus:border-border hover:border-border/50 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right">
          <span className={cn(
            "text-2xl font-bold tracking-tight",
            isHigh ? "text-success" : "text-danger"
          )}>
            %{percentage.toFixed(1).replace(/\.0$/, '')}
          </span>
        </div>

        <button
          onClick={() => onDelete(book.id)}
          className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Sil"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
