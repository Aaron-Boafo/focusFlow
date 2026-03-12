import { useAppStore } from "@/store/useAppStore"
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

export function WeeklyProductivityChart() {
  const { productivityData } = useAppStore()

  // Chart configuration to pass to shadcn ChartContainer
  const chartConfig = {
    hours: {
      label: "Hours Typed",
      color: "hsl(var(--primary))",
    },
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold">Weekly Productivity</h4>
          <p className="text-sm text-muted-foreground">
            Average 5.2 hours per day
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
