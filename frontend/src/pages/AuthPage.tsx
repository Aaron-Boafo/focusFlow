import { useState } from "react"
import { Navbar } from "@/components/LandingSections"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck, Loader2 } from "lucide-react"

export default function AuthPage() {
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <Navbar />

      <main className="flex flex-1 items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-background to-background dark:from-primary/5">
        <div className="w-full max-w-[480px]">
          <Tabs defaultValue="login" className="w-full">
            {/* Tab Triggers */}
            <div className="mb-6 flex justify-center">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2 rounded-xl p-1 shadow-sm">
                <TabsTrigger value="login" className="rounded-lg py-2.5 font-semibold">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg py-2.5 font-semibold">
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Login Tab */}
            <TabsContent value="login" className="mt-0 outline-none">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] md:p-10">
                <div className="mb-8 text-center md:text-left">
                  <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground">
                    Welcome Back
                  </h1>
                  <p className="text-muted-foreground">
                    Please enter your details to sign in.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-semibold text-foreground/80">
                      Email
                    </label>
                    <div className="group relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary h-5 w-5" />
                      <input
                        type="email"
                        placeholder="name@company.com"
                        className="h-14 w-full rounded-xl border border-input bg-muted/50 pl-11 pr-4 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-sm font-semibold text-foreground/80">
                        Password
                      </label>
                      <a
                        href="#"
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="group relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary h-5 w-5" />
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-14 w-full rounded-xl border border-input bg-muted/50 pl-11 pr-12 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="h-14 w-full rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <p className="text-[13px] text-muted-foreground">
                      Redirecting to Dashboard upon success
                    </p>
                  </div>
                </form>

                <div className="mt-8 flex justify-center gap-6 opacity-60 transition-all duration-500 hover:grayscale-0 grayscale">
                  <div className="flex h-8 w-24 items-center justify-center rounded bg-muted">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Company A
                    </span>
                  </div>
                  <div className="flex h-8 w-24 items-center justify-center rounded bg-muted">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Company B
                    </span>
                  </div>
                  <div className="flex h-8 w-24 items-center justify-center rounded bg-muted">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Company C
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="mt-0 outline-none">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] md:p-10">
                <div className="mb-8 text-center">
                  <h1 className="mb-2 text-3xl font-black text-foreground">
                    Create Your Account
                  </h1>
                  <p className="text-muted-foreground">
                    Join FocusFlow to start your journey today
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="ml-1 text-sm font-semibold text-foreground/80">
                      Full Name
                    </label>
                    <div className="group relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary h-5 w-5" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="py-3.5 w-full rounded-xl border border-input bg-muted/50 pl-11 pr-4 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="ml-1 text-sm font-semibold text-foreground/80">
                      Email Address
                    </label>
                    <div className="group relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary h-5 w-5" />
                      <input
                        type="email"
                        placeholder="name@company.com"
                        className="py-3.5 w-full rounded-xl border border-input bg-muted/50 pl-11 pr-4 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <p className="px-1 text-[11px] text-muted-foreground">
                      Please enter a valid email address format.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="ml-1 text-sm font-semibold text-foreground/80">
                      Password
                    </label>
                    <div className="group relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary h-5 w-5" />
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="py-3.5 w-full rounded-xl border border-input bg-muted/50 pl-11 pr-12 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showSignupPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <div className="mt-2 flex gap-1 px-1">
                      <div className="h-1 flex-1 rounded-full bg-primary/40"></div>
                      <div className="h-1 flex-1 rounded-full bg-border"></div>
                      <div className="h-1 flex-1 rounded-full bg-border"></div>
                      <div className="h-1 flex-1 rounded-full bg-border"></div>
                    </div>
                    <p className="px-1 text-[11px] text-muted-foreground">
                      Password must be at least 8 characters long.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="ml-1 text-sm font-semibold text-foreground/80">
                      Confirm Password
                    </label>
                    <div className="group relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary h-5 w-5" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="py-3.5 w-full rounded-xl border border-input bg-muted/50 pl-11 pr-4 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <p className="px-1 text-[11px] text-muted-foreground">
                      Passwords must match exactly.
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="py-4 w-full rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-8 flex justify-center gap-6">
                  <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                  <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    Help Center
                  </a>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
