import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"
import { Home, ArrowLeft, Ghost } from "lucide-react"

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background text-foreground selection:bg-primary/30">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/20" />
      <div className="absolute top-0 right-0 -z-10 h-[300px] w-[300px] bg-primary/5 blur-[100px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[300px] w-[300px] bg-primary/5 blur-[100px]" />

      {/* Floating Elements Animation */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8"
      >
        <div className="relative shrink-0">
          <Ghost className="h-24 w-24 text-primary" strokeWidth={1.5} />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary shadow-[0_0_15px_var(--primary)]"
          />
        </div>
      </motion.div>

      <div className="z-10 flex flex-col items-center px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-8xl font-black tracking-tighter sm:text-9xl"
        >
          404
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 max-w-md"
        >
          <h2 className="text-2xl font-bold text-foreground/90 sm:text-3xl">
            You've drifted out of focus
          </h2>
          <p className="mt-4 text-muted-foreground">
            The page you're looking for has either been moved, deleted, or never existed in this timeline.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center gap-2 rounded-full border border-border bg-card px-8 py-3 transition-all hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-90 active:scale-95"
          >
            <Home className="h-4 w-4" />
            Back to Dashboard
          </button>
        </motion.div>
      </div>

      {/* Decorative Stars/Dots */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 2000 - 1000, 
            y: Math.random() * 2000 - 1000,
            opacity: Math.random()
          }}
          animate={{ 
            y: [0, -1000],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute h-1 w-1 rounded-full bg-foreground/20"
        />
      ))}
    </div>
  )
}

