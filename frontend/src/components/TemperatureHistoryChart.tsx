import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { LineChart, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { SensorMeasure } from "@/types/sensor";
import { parseMeasuredAt } from "@/lib/parseMeasuredAt";

type TemperatureHistoryChartProps = {
  sensorName: string;
  history: SensorMeasure[];
  isLoading: boolean;
};

type ChartPoint = {
  time: string;
  measuredAt: string;
  temperature: number;
};

const formatTime = (date: Date) => format(date, "HH:mm", { locale: fr });

const TemperatureHistoryChart = ({ sensorName, history, isLoading }: TemperatureHistoryChartProps) => {
  const chartData: ChartPoint[] = useMemo(
    () =>
      history
        .map((measure) => {
          const date = parseMeasuredAt(measure.measuredAt);
          if (!date) return null;

          return {
            time: formatTime(date),
            measuredAt: date.toISOString(),
            temperature: measure.temperature,
          };
        })
        .filter(Boolean) as ChartPoint[],
    [history],
  );

  const isEmpty = !isLoading && chartData.length === 0;

  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-light text-primary">
            <LineChart className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Historique</p>
            <p className="text-xs text-muted-foreground">{sensorName} · 24h</p>
          </div>
        </div>
      </div>

      <div className="h-36">
        {isLoading && (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {isEmpty && (
          <div className="flex h-full flex-col items-center justify-center text-sm text-muted-foreground">
            <p>Pas de mesures récentes</p>
          </div>
        )}

        {!isLoading && !isEmpty && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: 4, right: 4, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id={`temperatureGradient-${sensorName}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--leaf))" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="hsl(var(--leaf))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 14,
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "var(--shadow-card)",
                }}
                formatter={(value: number) => [`${value.toFixed(1)} °C`, "Température"]}
                labelFormatter={(label, payload) => {
                  const measuredAt = payload?.[0]?.payload?.measuredAt;
                  return measuredAt
                    ? format(new Date(measuredAt), "EEEE d MMM · HH:mm", { locale: fr })
                    : label;
                }}
              />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="hsl(var(--leaf))"
                strokeWidth={2.6}
                fill={`url(#temperatureGradient-${sensorName})`}
                dot={false}
                activeDot={{ r: 5, fill: "hsl(var(--leaf))", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TemperatureHistoryChart;
