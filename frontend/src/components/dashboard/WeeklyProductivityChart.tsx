import { SessionStore } from "@/store/SessionStore"
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Given a date, returns "Mon", "Tue", etc.
function getDayLabel(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-US", { weekday: "short" })
}

export function WeeklyProductivityChart() {
  const history = SessionStore((s) => s.history)

  // Build the last 7 days in order (oldest → today)
  const today = new Date()
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return d.toISOString().split("T")[0]
  })

  const productivityData = weekDays.map((dateStr) => {
    const sessionsForDay = history.filter(
      (s) => s.date === dateStr && s.type === "Focus"
    )
    const totalSeconds = sessionsForDay.reduce(
      (acc, s) => acc + s.elapsedTime,
      0
    )
    const hours = parseFloat((totalSeconds / 3600).toFixed(2))
    return { day: getDayLabel(dateStr), hours }
  })

  const avgHours = productivityData.length
    ? (
        productivityData.reduce((a, d) => a + d.hours, 0) /
        productivityData.length
      ).toFixed(1)
    : "0"

  const chartConfig = {
    hours: {
      label: "Focus Hours",
      color: "var(--primary)",
    },
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold">Weekly Productivity</h4>
          <p className="text-sm text-muted-foreground">
            Avg {avgHours} hours per day this week
          </p>
        </div>
        <Select defaultValue="7days">
          <SelectTrigger className="w-[140px] rounded-lg bg-muted border-none">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-64 w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productivityData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toUpperCase()}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: 500 }}
                dy={10}
              />
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="hours"
                fill="var(--color-hours)"
                radius={[4, 4, 4, 4]}
                className="hover:opacity-80 transition-all cursor-pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
