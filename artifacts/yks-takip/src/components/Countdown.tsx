import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// June 20, 2026 at 10:15:00 UTC+3
// 2026-06-20T10:15:00.000+03:00
const TARGET_DATE = new Date("2026-06-20T10:15:00+03:00").getTime();

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft(); // Initial call
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-2 my-8">
      <div className="flex space-x-3 sm:space-x-6 text-center">
        <TimeUnit value={timeLeft.days} label="Gün" />
        <TimeSeparator />
        <TimeUnit value={timeLeft.hours} label="Saat" />
        <TimeSeparator />
        <TimeUnit value={timeLeft.minutes} label="Dakika" />
        <TimeSeparator />
        <TimeUnit value={timeLeft.seconds} label="Saniye" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[3.5rem] sm:min-w-[4.5rem]">
      <span className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">
        {label}
      </span>
    </div>
  );
}

function TimeSeparator() {
  return (
    <div className="text-3xl sm:text-5xl font-light text-border flex items-start pt-[-0.25rem]">
      :
    </div>
  );
}
