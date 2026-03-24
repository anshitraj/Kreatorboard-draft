import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-[400px] w-full flex flex-col items-center justify-center gap-6">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_40px_rgba(123,97,255,0.4)]"
      >
        <Sparkles className="w-8 h-8 text-white" />
      </motion.div>
      <p className="text-lg font-medium text-muted-foreground animate-pulse font-display">
        {message}
      </p>
    </div>
  );
}
