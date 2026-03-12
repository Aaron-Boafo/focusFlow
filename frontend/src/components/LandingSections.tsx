import { Button } from "@/components/ui/button"
import { Boxes } from "@/components/ui/background-boxes"
import { Card, CardContent } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ArrowRight, ChevronRight, TrendingUp, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Statistics } from "@/constants"
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background"
import { Link } from "react-router-dom"

export function Navbar() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-md">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg leading-none font-bold text-foreground">
            FocusFlow
          </h1>
          <p className="mt-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Stay focused.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        <Link to="/auth">
          <Button variant="ghost" size="sm">
            Login
          </Button>
        </Link>
        <Link to="/auth">
          <Button size="sm" className="shadow-lg shadow-primary/20">
            Sign Up
          </Button>
        </Link>
      </div>
    </header>
  )
}

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden border-b border-border/30 pt-12 pb-20 lg:pt-24 lg:pb-32">
      {/* Animated dotted glow background */}
      <DottedGlowBackground
        gap={20}
        radius={1.5}
        opacity={0.45}
        glowColor="rgba(99, 102, 241, 0.9)"
        darkGlowColor="rgba(129, 140, 248, 0.9)"
        color="rgba(0,0,0,0.35)"
        darkColor="rgba(255,255,255,0.35)"
        speedScale={0.6}
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-5xl leading-[1.1] font-black tracking-tight text-foreground lg:text-7xl">
              Stay focused. <br />
              <span className="text-primary">Get things done.</span>
            </h2>

            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              Master your productivity with task management, Pomodoro focus
              timers, and deep analytics. Earn XP as you complete tasks and
              focus sessions.
            </p>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button
                size="lg"
                className="gap-2 px-8 py-6 text-base shadow-xl shadow-primary/30"
              >
                Signup
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-background/50 px-8 py-6 text-base backdrop-blur-sm"
              >
                Try Demo
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* App preview card */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 rotate-6 rounded-[2rem] bg-primary/20 blur-3xl" />
            <Card className="rounded-[2rem] border-border/50 bg-background/50 p-2 shadow-2xl backdrop-blur-sm">
              <div className="aspect-4/3 w-full overflow-hidden rounded-[1.5rem] bg-muted">
                <img
                  alt="Screenshot of the FocusFlow dashboard showing task lists and a timer"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM-pPdp_Mt5g1awzGrSSBvd63nnkwQMvlHi92DYH6vTG4jOBmQfC9sDGTYu5XVkpccPD8_17QGGxdA3Kle4jfS7lH1CVyYHdkIw752Piz8Q_ZhkaJth2Dq0MCfPKbAdjeahDORp_oFKmbrNTxrV-uTJi3KiKUnrRyFSjloQ0EqTeNuS2bF1LPl6zPLNFwqxEvPowMb7UuuDM43nV6r_Eq2oh2olq_ek8mVRRAxOb-ySz5sSC06RSaQSidSUjeK-u7XY_9QUKpmnA"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export function StatsSection() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {Statistics.map((stat) => (
        <Popover key={stat.label}>
          <PopoverTrigger asChild>
            <Card className="cursor-pointer transition-all hover:border-primary/40 hover:shadow-md">
              <CardContent className="p-8">
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <div className="flex items-end justify-between">
                  <h4 className="text-3xl font-bold">{stat.value}</h4>
                  <span className="flex items-center gap-1 text-sm font-bold text-emerald-500">
                    <TrendingUp className="h-3 w-3" />
                    {stat.growth}
                  </span>
                </div>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: stat.pct }}
                  />
                </div>
              </CardContent>
            </Card>
          </PopoverTrigger>
          <PopoverContent className="w-56 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">{stat.label}</strong> grew{" "}
              {stat.growth} this month. Click on the card to learn more.
            </p>
          </PopoverContent>
        </Popover>
      ))}
    </section>
  )
}

export function FeaturesSection() {
  const featureCards = [
    {
      title: "Task Management",
      desc: "Organize your day with intuitive drag-and-drop tasks, subtasks, and priority levels. Never lose track of what matters most.",
      image: "/feature-tasks.png",
      badge: "Core",
      gradient: "from-violet-500/20 via-indigo-500/10 to-transparent",
      glow: "group-hover:shadow-violet-500/20",
      accent: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      large: true,
    },
    {
      title: "Pomodoro Timer",
      desc: "Use the classic focus method with customizable sessions and break intervals to maintain deep focus.",
      image: "/feature-pomodoro.png",
      badge: "Focus",
      gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
      glow: "group-hover:shadow-cyan-500/20",
      accent: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      large: false,
    },
    {
      title: "Deep Analytics",
      desc: "Visualize your focus patterns and discover when you are most productive with rich charting and heatmaps.",
      image: "/feature-analytics.png",
      badge: "Insights",
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      glow: "group-hover:shadow-emerald-500/20",
      accent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      ),
      large: false,
    },
  ]

  const [large, ...small] = featureCards

  return (
    <section className="space-y-12 py-16">
      {/* Section header */}
      <div className="mx-auto max-w-2xl space-y-5 text-center">
        <h3 className="text-4xl font-black tracking-tight lg:text-5xl">
          Everything you need to{" "}
          <span className="bg-linear-to-r from-primary via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            stay in flow
          </span>
        </h3>
        <p className="text-lg text-muted-foreground">
          Stop switching between apps. FocusFlow unifies your entire
          productivity stack in one beautifully crafted interface.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Large hero card */}
        <div
          className={`group relative flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-card shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${large.glow} lg:col-span-2`}
        >
          {/* Image */}
          <div className="relative h-64 overflow-hidden lg:h-72">
            <img
              src={large.image}
              alt={large.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Image overlay gradient */}
            <div
              className={`absolute inset-0 bg-linear-to-b ${large.gradient} from-transparent via-transparent to-card`}
            />
            {/* Badge */}
            <span
              className={`absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${large.accent}`}
            >
              {large.icon}
              {large.badge}
            </span>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-end space-y-3 p-8 pt-4">
            <h4 className="text-2xl font-bold">{large.title}</h4>
            <p className="text-base leading-relaxed text-muted-foreground">
              {large.desc}
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {["Drag & Drop", "Subtasks", "Priority Levels", "Due Dates"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Glow border on hover */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/5 transition-all ring-inset group-hover:ring-primary/30" />
        </div>

        {/* Small cards column */}
        <div className="flex flex-col gap-5">
          {small.map((card) => (
            <div
              key={card.title}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-card shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${card.glow} flex-1`}
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 bg-linear-to-b ${card.gradient} from-transparent via-transparent to-card`}
                />
                <span
                  className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${card.accent}`}
                >
                  {card.icon}
                  {card.badge}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-end space-y-2 p-6 pt-3">
                <h4 className="text-xl font-bold">{card.title}</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {card.desc}
                </p>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/5 transition-all ring-inset group-hover:ring-primary/30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-12 text-center text-white lg:p-24">
      {/* Overlay mask: transparent at center (shows bg), white at edges (masks boxes) — matches demo exactly */}
      <div className="pointer-events-none absolute inset-0 z-1 bg-slate-900 mask-[radial-gradient(transparent,white)]" />

      {/* Background boxes grid — visible at edges through the mask */}
      <Boxes />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl space-y-6">
        <h2 className="text-4xl font-bold text-white lg:text-5xl">
          Ready to reclaim your time?
        </h2>
        <p className="text-xl text-neutral-300">
          Join 10,000+ users who have transformed their work habits with
          FocusFlow.
        </p>
        <div className="flex flex-col justify-center gap-4 pt-8 sm:flex-row">
          <Button
            size="lg"
            className="bg-white px-10 py-6 text-lg font-bold text-slate-900 hover:bg-neutral-100"
          >
            Get Started Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 bg-transparent px-10 py-6 text-lg font-bold text-white hover:bg-white/10"
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  )
}
