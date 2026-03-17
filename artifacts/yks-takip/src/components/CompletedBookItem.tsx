import { BookOpen, Calendar, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import type { Book } from "@/hooks/use-books";

interface CompletedBookItemProps {
  book: Book;
}

export function CompletedBookItem({ book }: CompletedBookItemProps) {
  const dateStr = book.completedAt 
    ? format(new Date(book.completedAt), "d MMMM yyyy", { locale: tr })
    : "Bilinmiyor";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-muted/30 border border-border/50 rounded-xl">
      <div className="flex items-start gap-3 mb-3 sm:mb-0">
        <div className="mt-1 bg-success/10 p-1.5 rounded-full shrink-0">
          <CheckCircle2 className="w-5 h-5 text-success" />
        </div>
        <div>
          <h4 className="font-bold text-lg text-foreground leading-tight">{book.name}</h4>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              {book.totalPages} Sayfa
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-white px-3 py-1.5 rounded-lg border border-border/50 shadow-sm shrink-0 self-start sm:self-auto">
        <Calendar className="w-4 h-4" />
        {dateStr}
      </div>
    </div>
  );
}
