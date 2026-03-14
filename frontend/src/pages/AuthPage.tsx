import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Navbar } from "@/components/LandingSections"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext"
import { loginSchema, signupSchema } from "@/lib/schemas"
import { toast } from "sonner"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Loader2,
  ArrowRight,
  HelpCircle,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, signup, isLoading } = useAuth()

  const mode = searchParams.get("mode") || "login"

  // Form states
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPass, setLoginPass] = useState("")

  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPass, setSignupPass] = useState("")
  const [signupConfirmPass, setSignupConfirmPass] = useState("")

  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Zod validation
    const result = loginSchema.safeParse({
      email: loginEmail,
      password: loginPass,
    })
    if (!result.success) {
      toast.error(result.error.issues[0].message)
      return
    }

    const toastId = toast.loading("Signing in to your account...")

    try {
      await login(loginEmail, loginPass)
      toast.success(`Welcome back!`, { id: toastId })
      navigate("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please check your credentials.", {
        id: toastId,
      })
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    // Zod validation
    const result = signupSchema.safeParse({
      name: signupName,
      email: signupEmail,
      password: signupPass,
      confirmPassword: signupConfirmPass,
    })

    if (!result.success) {
      toast.error(result.error.issues[0].message)
      return
    }

    const toastId = toast.loading("Creating your profile...")

    try {
      await signup(signupName, signupEmail, signupPass)
      toast.success("Account created successfully! Welcome aboard.", {
        id: toastId,
      })
      navigate("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "Signup failed. Please try again.", { id: toastId })
    }
  }

  const skipToDemo = () => {
    navigate("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <Navbar />

      <main className="flex flex-1 items-center justify-center bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-background to-background p-6 dark:from-primary/5">
        <div className="w-full max-w-[480px]">
          <Tabs defaultValue={mode} className="w-full">
            {/* Tab Triggers */}
            <div className="mb-6 flex justify-center">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2 rounded-xl p-1 shadow-sm">
                <TabsTrigger
                  value="login"
                  className="rounded-lg py-2.5 font-semibold"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-lg py-2.5 font-semibold"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Login Tab */}
            <TabsContent value="login" className="mt-0 outline-none">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-10 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                <div className="mb-8 text-center md:text-left">
                  <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground">
                    Welcome Back
                  </h1>
                  <p className="text-muted-foreground">
                    Please enter your details to sign in.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <div className="ml-1 flex items-center gap-1.5">
                      <label className="text-sm font-semibold text-foreground/80">
                        Email
                      </label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 cursor-help text-muted-foreground/60 transition-colors hover:text-primary" />
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="max-w-[200px] text-center"
                        >
                          Used to sync your data across devices.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="group relative">
                      <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="h-14 w-full rounded-xl border border-input bg-muted/50 pr-4 pl-11 transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-1.5">
                        <label className="text-sm font-semibold text-foreground/80">
                          Password
                        </label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 cursor-help text-muted-foreground/60 transition-colors hover:text-primary" />
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="max-w-[200px] text-center"
                          >
                            Must be at least 6 characters long.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <a
                        href="#"
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="group relative">
                      <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        placeholder="Enter your password"
                        className="h-14 w-full rounded-xl border border-input bg-muted/50 pr-12 pl-11 transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
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
                      className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
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

                  {isLoading && (
                    <div className="flex items-center justify-center gap-2 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <p className="text-[13px] text-muted-foreground">
                        Authenticating...
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="mt-0 outline-none">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-10 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                <div className="mb-8 text-center">
                  <h1 className="mb-2 text-3xl font-black text-foreground">
                    Create Your Account
                  </h1>
                  <p className="text-muted-foreground">
                    Join FocusFlow to start your journey today
                  </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="ml-1 text-sm font-semibold text-foreground/80">
                      Full Name
                    </label>
                    <div className="group relative">
                      <User className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <input
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-input bg-muted/50 py-3.5 pr-4 pl-11 transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="ml-1 flex items-center gap-1.5">
                      <label className="text-sm font-semibold text-foreground/80">
                        Email Address
                      </label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 cursor-help text-muted-foreground/60 transition-colors hover:text-primary" />
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="max-w-[200px] text-center"
                        >
                          Better results with a verified company email.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="group relative">
                      <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full rounded-xl border border-input bg-muted/50 py-3.5 pr-4 pl-11 transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <p className="px-1 text-[11px] text-muted-foreground">
                      Please enter a valid email address format.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="ml-1 flex items-center gap-1.5">
                      <label className="text-sm font-semibold text-foreground/80">
                        Password
                      </label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 cursor-help text-muted-foreground/60 transition-colors hover:text-primary" />
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="max-w-[200px] text-center"
                        >
                          Minimum 8 characters with at least one number.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="group relative">
                      <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        value={signupPass}
                        onChange={(e) => setSignupPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-input bg-muted/50 py-3.5 pr-12 pl-11 transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowSignupPassword(!showSignupPassword)
                        }
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {showSignupPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="ml-1 text-sm font-semibold text-foreground/80">
                      Confirm Password
                    </label>
                    <div className="group relative">
                      <ShieldCheck className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <input
                        type="password"
                        value={signupConfirmPass}
                        onChange={(e) => setSignupConfirmPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-input bg-muted/50 py-3.5 pr-4 pl-11 transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
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
              </div>
            </TabsContent>

            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                onClick={skipToDemo}
                className="group flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
              >
                Skip to Demo (Local Usage)
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex justify-center gap-6">
                <a
                  href="#"
                  className="text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  Help Center
                </a>
              </div>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
