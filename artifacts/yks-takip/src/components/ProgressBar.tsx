import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const roundedProgress = Number(safeProgress.toFixed(1));

  return (
    <div className="w-full my-10">
      <div className="flex justify-between items-end mb-3">
        <h2 className="text-lg font-semibold tracking-tight">Genel İlerleme</h2>
        <span className="text-2xl font-bold text-primary">
          %{roundedProgress}
        </span>
      </div>
      
      <div className="h-4 w-full bg-muted rounded-full overflow-hidden relative shadow-inner">
        <motion.div
          className="absolute top-0 left-0 h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${safeProgress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {/* Subtle shine effect on the bar */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20" />
      </div>
    </div>
  );
}
