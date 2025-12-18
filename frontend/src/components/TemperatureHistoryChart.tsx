import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  YAxis,
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
  isIdle?: boolean;
  isError?: boolean;
  periodLabel?: string;
  hours?: number;
};

type ChartPoint = {
  measuredAt: string;
  timestamp: number;
  temperature: number;
};

const TemperatureHistoryChart = ({
  sensorName,
  history,
  isLoading,
  isIdle = false,
  isError = false,
  periodLabel,
  hours,
}: TemperatureHistoryChartProps) => {
  const chartData: ChartPoint[] = useMemo(
    () =>
      history
        .map((measure) => {
          const date = parseMeasuredAt(measure.measuredAt);
          if (!date) return null;

          return {
            measuredAt: date.toISOString(),
            timestamp: date.getTime(),
            temperature: measure.temperature,
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.timestamp - b.timestamp) as ChartPoint[],
    [history],
  );

  const chartDurationHours = useMemo(() => {
    if (chartData.length < 2) return 0;

    const first = chartData[0]?.timestamp;
    const last = chartData[chartData.length - 1]?.timestamp;

    return first && last ? (last - first) / (1000 * 60 * 60) : 0;
  }, [chartData]);

  const { minTemp, maxTemp, avgTemp, yDomain } = useMemo(() => {
    if (!chartData.length) {
      return { minTemp: 0, maxTemp: 0, avgTemp: 0, yDomain: [0, 1] as [number, number] };
    }

    const temperatures = chartData.map((point) => point.temperature);
    const min = Math.min(...temperatures);
    const max = Math.max(...temperatures);
    const avg = temperatures.reduce((total, temp) => total + temp, 0) / temperatures.length;

    const padding = Math.max(0.2, (max - min) * 0.05);
    const domain: [number, number] = [min - padding, max + padding];

    return { minTemp: min, maxTemp: max, avgTemp: avg, yDomain: domain };
  }, [chartData]);

  const isEmpty = !isLoading && !isIdle && chartData.length === 0;

  const referenceTicks = useMemo(() => {
    const ticks = [minTemp, avgTemp, maxTemp];
    return [...new Set(ticks)].sort((a, b) => a - b);
  }, [minTemp, avgTemp, maxTemp]);

  const formatReferenceLabel = (value: number) => `${value.toFixed(1)}`;

  const formatTimeLabel = (timestamp: number) => {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "";

    const extendedRangeHours = hours ?? chartDurationHours;

    if (extendedRangeHours > 48) {
      return format(date, "EEE d", { locale: fr });
    }

    if (extendedRangeHours > 24) {
      return format(date, "EEE HH:mm", { locale: fr });
    }

    return format(date, "HH:mm", { locale: fr });
  };

  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-1">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-light text-primary">
          <LineChart className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Historique</p>
          <p className="text-xs text-muted-foreground">
            {sensorName}
            {periodLabel ? ` · ${periodLabel}` : ""}
          </p>
        </div>
      </div>

      <div className="h-36">
        {isIdle && (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            <p>Choisissez une période pour charger l'historique.</p>
          </div>
        )}

        {isLoading && (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {isError && !isLoading && !isIdle && (
          <div className="flex h-full flex-col items-center justify-center text-sm text-muted-foreground">
            <p>Historique indisponible · données de secours affichées.</p>
          </div>
        )}

        {isEmpty && (
          <div className="flex h-full flex-col items-center justify-center text-sm text-muted-foreground">
            <p>Pas de mesures récentes</p>
          </div>
        )}

        {!isLoading && !isIdle && !isEmpty && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: 0, right: 6, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id={`temperatureGradient-${sensorName}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--leaf))" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="hsl(var(--leaf))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <YAxis
                domain={yDomain}
                ticks={referenceTicks}
                width={44}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "hsl(var(--muted-foreground))",
                }}
                tickFormatter={formatReferenceLabel}
              />
              <XAxis
                dataKey="timestamp"
                type="number"
                scale="time"
                domain={["dataMin", "dataMax"]}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                tickFormatter={formatTimeLabel}
              />
              <ReferenceLine
                y={maxTemp}
                stroke="hsl(var(--leaf))"
                strokeDasharray="4 4"
              />
              <ReferenceLine
                y={avgTemp}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
              />
              <ReferenceLine
                y={minTemp}
                stroke="hsl(var(--leaf))"
                strokeDasharray="4 4"
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
