import { useState, useEffect } from "react"
import { Timer, Settings2, Moon, Sun, User, Edit2 } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { SessionStore } from "@/store/SessionStore"
import { toast } from "sonner"
import { useTheme } from "@/components/theme-provider"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { accountUpdateSchema } from "@/lib/schemas"
import { SettingsSkeleton } from "@/components/skeletons/SettingsSkeleton"
import { useAuth } from "@/context/AuthContext"

export default function SettingsPage() {
  const { user: authUser, isAuthenticated } = useAuth()
  const { user, updateUser, isLoading: appLoading } = useAppStore()
  const { isLoading: sessionLoading } = SessionStore()

  if (appLoading || sessionLoading) return <SettingsSkeleton />
  
  const displayName = isAuthenticated ? (authUser?.displayName || "User") : "Guest"
  
  // Account modal state
  const [userName, setUserName] = useState(displayName)
  const [userPassword, setUserPassword] = useState(user.password || "")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getInitials = (name: string) => {
    if (!name) return "GS"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleUpdateAccount = () => {
    // Zod validation
    const result = accountUpdateSchema.safeParse({ name: userName, password: userPassword })
    
    if (!result.success) {
      toast.error(result.error.issues[0].message)
      return
    }

    updateUser({ name: userName, password: userPassword })
    toast.success("Account updated successfully!")
    setIsDialogOpen(false)
  }


  
  // Use selectors for better reactivity
  const settings = SessionStore((state) => state.settings)
  const updateSettings = SessionStore((state) => state.updateSettings)

  const [pomodoroLength, setPomodoroLength] = useState(settings.focus / 60)
  const [shortBreakLength, setShortBreakLength] = useState(
    settings.shortBreak / 60
  )
  const [longBreakLength, setLongBreakLength] = useState(
    settings.longBreak / 60
  )

  const [desktopEnabled, setDesktopEnabled] = useState(
    settings.desktopNotifications ?? true
  )
  const [autoBreakEnabled, setAutoBreakEnabled] = useState(
    settings.autoStartBreaks ?? false
  )
  
  const { theme, setTheme } = useTheme()

  // Sync local state when settings change (e.g. from storage load)
  useEffect(() => {
    setPomodoroLength(settings.focus / 60)
    setShortBreakLength(settings.shortBreak / 60)
    setLongBreakLength(settings.longBreak / 60)
    setDesktopEnabled(settings.desktopNotifications ?? true)
    setAutoBreakEnabled(settings.autoStartBreaks ?? false)
  }, [settings])

  const handleSave = () => {
    updateSettings({
      focus: pomodoroLength * 60,
      shortBreak: shortBreakLength * 60,
      longBreak: longBreakLength * 60,
      desktopNotifications: desktopEnabled,
      autoStartBreaks: autoBreakEnabled,
    })
    toast("Settings updated successfully!")
  }

  const handleDiscard = () => {
    setPomodoroLength(settings.focus / 60)
    setShortBreakLength(settings.shortBreak / 60)
    setLongBreakLength(settings.longBreak / 60)
    setDesktopEnabled(settings.desktopNotifications ?? true)
    setAutoBreakEnabled(settings.autoStartBreaks ?? false)
  }

  const handleToggleDesktop = () => {
    const nextState = !desktopEnabled
    setDesktopEnabled(nextState)
    if (nextState && "Notification" in window) {
      Notification.requestPermission()
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Settings
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Manage your focus sessions and preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* Timer Configuration Section */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 p-6 dark:border-slate-800">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Timer className="h-5 w-5 text-primary" />
              Timer Configuration
            </h3>
          </div>
          <div className="space-y-8 p-6">
            {/* Pomodoro */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Pomodoro Duration
                </label>
                <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-primary dark:bg-slate-800">
                  {pomodoroLength}m
                </span>
              </div>
              <div className="group relative flex h-6 w-full items-center">
                <div className="absolute h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <div
                  className="absolute h-1.5 rounded-full bg-primary"
                  style={{ width: `${(pomodoroLength / 240) * 100}%` }}
                ></div>
                <div
                  className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 cursor-pointer rounded-full border-2 border-primary bg-white shadow-md"
                  style={{ left: `${(pomodoroLength / 240) * 100}%` }}
                ></div>
                <input
                  className="absolute z-10 h-1.5 w-full cursor-pointer appearance-none opacity-0"
                  max="240"
                  min="1"
                  type="range"
                  value={pomodoroLength}
                  onChange={(e) => setPomodoroLength(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Short Break */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Short Break Duration
                </label>
                <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-primary dark:bg-slate-800">
                  {shortBreakLength}m
                </span>
              </div>
              <div className="group relative flex h-6 w-full items-center">
                <div className="absolute h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <div
                  className="absolute h-1.5 rounded-full bg-primary"
                  style={{ width: `${(shortBreakLength / 30) * 100}%` }}
                ></div>
                <div
                  className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 cursor-pointer rounded-full border-2 border-primary bg-white shadow-md"
                  style={{ left: `${(shortBreakLength / 30) * 100}%` }}
                ></div>
                <input
                  className="absolute z-10 h-1.5 w-full cursor-pointer appearance-none opacity-0"
                  max="30"
                  min="1"
                  type="range"
                  value={shortBreakLength}
                  onChange={(e) => setShortBreakLength(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Long Break */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Long Break Duration
                </label>
                <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-primary dark:bg-slate-800">
                  {longBreakLength}m
                </span>
              </div>
              <div className="group relative flex h-6 w-full items-center">
                <div className="absolute h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <div
                  className="absolute h-1.5 rounded-full bg-primary"
                  style={{ width: `${(longBreakLength / 60) * 100}%` }}
                ></div>
                <div
                  className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 cursor-pointer rounded-full border-2 border-primary bg-white shadow-md"
                  style={{ left: `${(longBreakLength / 60) * 100}%` }}
                ></div>
                <input
                  className="absolute z-10 h-1.5 w-full cursor-pointer appearance-none opacity-0"
                  max="60"
                  min="1"
                  type="range"
                  value={longBreakLength}
                  onChange={(e) => setLongBreakLength(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 p-6 dark:border-slate-800">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Settings2 className="h-5 w-5 text-primary" />
              Preferences
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* Desktop Notifications */}
            <div className="flex items-center justify-between p-6">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Desktop Notifications
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Receive alerts when session ends
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={desktopEnabled}
                  onChange={handleToggleDesktop}
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-primary peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-slate-700"></div>
              </label>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-6">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Theme Mode
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Switch between light and dark interface
                </p>
              </div>
              <div className="flex items-center rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-all ${
                    theme === "light"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                      : "text-slate-500 hover:text-primary dark:text-slate-400"
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-all ${
                    theme === "dark"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                      : "text-slate-500 hover:text-primary dark:text-slate-400"
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </button>
              </div>
            </div>

            {/* Auto-start Breaks */}
            <div className="flex items-center justify-between p-6">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Auto-start Breaks
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Begin break timer automatically after pomodoro
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={autoBreakEnabled}
                  onChange={() => setAutoBreakEnabled(!autoBreakEnabled)}
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-primary peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-slate-700"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Profile Section */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 p-6 dark:border-slate-800">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <User className="h-5 w-5 text-primary" />
              Account
            </h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-1">
                <div className="group relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-slate-50 bg-primary/10 text-xl font-bold text-primary dark:border-slate-700">
                    {getInitials(isAuthenticated ? (authUser?.displayName || "User") : "Guest")}
                  </div>
                  <button className="absolute right-0 bottom-0 rounded-full border-2 border-white bg-primary p-1 text-white dark:border-slate-900">
                    <Edit2 className="h-3 w-3" />
                  </button>
                </div>
                <div className="text-center sm:text-left font-bold text-slate-900 dark:text-white">
                  <p>
                    {displayName}
                  </p>
                  <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
                    {isAuthenticated ? authUser?.email : "guest@focusflow.demo"}
                  </p>
                </div>
              </div>
              
              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <button 
                    disabled={!isAuthenticated}
                    className="w-full sm:w-auto rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Manage Account
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-[425px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                       <User className="h-5 w-5 text-primary" />
                       Update Profile
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Update your personal information below. Changes will be saved to your local session.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                      <Input 
                        id="name" 
                        value={userName} 
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="pass" className="text-sm font-medium">New Password (optional)</label>
                      <Input 
                        id="pass" 
                        type="password"
                        value={userPassword} 
                        onChange={(e) => setUserPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <button
                      onClick={handleUpdateAccount}
                      className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                      Save Changes
                    </button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </section>

        {/* Save Changes Floating Footer */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleDiscard}
              className="rounded-lg px-6 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-primary px-8 py-2.5 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
