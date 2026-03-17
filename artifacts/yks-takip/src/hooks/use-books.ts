import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import confetti from "canvas-confetti";

export interface Book {
  id: string;
  name: string;
  totalPages: number;
  currentPage: number;
  completedAt?: string;
  createdAt: number;
}

const STORAGE_KEY = "yks-books";

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBooks(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load books", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever books change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  }, [books, isLoaded]);

  const triggerConfetti = useCallback(() => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  const addBook = useCallback((name: string, totalPages: number, currentPage: number) => {
    const isCompleted = currentPage >= totalPages && totalPages > 0;
    
    if (isCompleted) {
      triggerConfetti();
    }

    const newBook: Book = {
      id: uuidv4(),
      name: name.trim(),
      totalPages,
      currentPage: isCompleted ? totalPages : currentPage,
      completedAt: isCompleted ? new Date().toISOString() : undefined,
      createdAt: Date.now(),
    };

    setBooks((prev) => [...prev, newBook]);
  }, [triggerConfetti]);

  const updateBook = useCallback((id: string, updates: Partial<Book>) => {
    setBooks((prev) => 
      prev.map((book) => {
        if (book.id !== id) return book;
        
        const updatedBook = { ...book, ...updates };
        
        // Auto-complete logic
        if (updatedBook.currentPage >= updatedBook.totalPages && updatedBook.totalPages > 0) {
          updatedBook.currentPage = updatedBook.totalPages;
          if (!updatedBook.completedAt) {
            updatedBook.completedAt = new Date().toISOString();
            triggerConfetti();
          }
        } else if (updatedBook.currentPage < updatedBook.totalPages) {
          // Revert completion if pages are adjusted downwards
          updatedBook.completedAt = undefined;
        }

        return updatedBook;
      })
    );
  }, [triggerConfetti]);

  const deleteBook = useCallback((id: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  }, []);

  // Derived state
  const activeBooks = books
    .filter((b) => !b.completedAt)
    .sort((a, b) => {
      const pA = a.totalPages > 0 ? a.currentPage / a.totalPages : 0;
      const pB = b.totalPages > 0 ? b.currentPage / b.totalPages : 0;
      return pB - pA; // Descending
    });

  const completedBooks = books
    .filter((b) => !!b.completedAt)
    .sort((a, b) => {
      const dateA = new Date(a.completedAt!).getTime();
      const dateB = new Date(b.completedAt!).getTime();
      return dateA - dateB; // Ascending (oldest completed first)
    });

  const totalActivePages = activeBooks.reduce((sum, b) => sum + b.totalPages, 0);
  const currentActivePages = activeBooks.reduce((sum, b) => sum + b.currentPage, 0);
  const overallProgress = totalActivePages > 0 ? (currentActivePages / totalActivePages) * 100 : 0;

  return {
    books,
    activeBooks,
    completedBooks,
    overallProgress,
    isLoaded,
    addBook,
    updateBook,
    deleteBook,
  };
}
