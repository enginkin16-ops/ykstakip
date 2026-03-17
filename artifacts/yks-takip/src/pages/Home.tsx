import { useBooks } from "@/hooks/use-books";
import { Countdown } from "@/components/Countdown";
import { ProgressBar } from "@/components/ProgressBar";
import { AddBook } from "@/components/AddBook";
import { ActiveBookItem } from "@/components/ActiveBookItem";
import { CompletedBookItem } from "@/components/CompletedBookItem";
import { motion, AnimatePresence } from "framer-motion";

export function Home() {
  const { 
    activeBooks, 
    completedBooks, 
    overallProgress, 
    isLoaded, 
    addBook, 
    updateBook, 
    deleteBook 
  } = useBooks();

  if (!isLoaded) {
    return <div className="min-h-screen bg-white" />; // Render empty white screen until localStorage loads
  }

  return (
    <div className="min-h-screen w-full bg-white text-black font-sans selection:bg-primary/20 selection:text-primary">
      <main className="max-w-[700px] mx-auto px-4 sm:px-6 py-12 pb-24">
        
        {/* HEADER */}
        <header className="text-center mb-6">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tighter text-primary drop-shadow-sm">
            Yks 2026 TAKİP
          </h1>
        </header>

        {/* COUNTDOWN */}
        <Countdown />

        {/* PROGRESS */}
        <ProgressBar progress={overallProgress} />

        {/* ADD BOOK */}
        <AddBook onAdd={addBook} />

        {/* ACTIVE BOOKS */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight border-b-4 border-primary pb-1 inline-block">
              Aktif Kitaplar
            </h2>
            <span className="bg-muted text-muted-foreground font-semibold px-3 py-1 rounded-full text-sm">
              {activeBooks.length}
            </span>
          </div>

          {activeBooks.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 border-2 border-dashed border-border/50 rounded-2xl">
              <p className="text-muted-foreground font-medium text-lg">Şu an aktif kitabınız bulunmuyor.</p>
              <p className="text-sm text-muted-foreground mt-1">Yukarıdan yeni bir kitap ekleyerek başlayın.</p>
            </div>
          ) : (
            <div className="space-y-3 relative">
              <AnimatePresence mode="popLayout">
                {activeBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <ActiveBookItem
                      book={book}
                      onUpdate={updateBook}
                      onDelete={deleteBook}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* COMPLETED BOOKS */}
        {completedBooks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight border-b-4 border-success pb-1 inline-block">
                Bitirdiğim Kitaplar
              </h2>
              <span className="bg-success/10 text-success font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1.5">
                {completedBooks.length}
              </span>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {completedBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CompletedBookItem book={book} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}
        
      </main>
    </div>
  );
}
