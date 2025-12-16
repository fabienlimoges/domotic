import { useMemo, useState } from "react";
import { SensorCardProps } from "@/types/sensor";
import { Droplets, Gauge, Leaf } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import TemperatureHistoryChart from "@/components/TemperatureHistoryChart";
import { buildMockHistory, useTemperatureHistory } from "@/hooks/useTemperatureHistory";
import { parseMeasuredAt } from "@/lib/parseMeasuredAt";
import { Button } from "@/components/ui/button";

const SensorCard = ({ sensor, staleThresholdMinutes = 60 }: SensorCardProps) => {
  const measureDate = parseMeasuredAt(sensor.measuredAt);
  const isStale = measureDate
    ? (Date.now() - measureDate.getTime()) > staleThresholdMinutes * 60 * 1000
    : false;

  const timeAgo = measureDate
    ? formatDistanceToNow(measureDate, { addSuffix: true, locale: fr })
    : "Date inconnue";

  const [historyEnabled, setHistoryEnabled] = useState(false);
  const {
    data: history,
    isLoading: isHistoryLoading,
    isFetching: isHistoryFetching,
    isError: isHistoryError,
    isIdle: isHistoryIdle,
    refetch: refetchHistory,
  } = useTemperatureHistory(sensor.sensorName, 24, historyEnabled);

  const historyPoints = useMemo(
    () => (isHistoryError ? buildMockHistory(sensor.temperature) : history ?? []),
    [history, isHistoryError, sensor.temperature],
  );
  const showHistorySpinner = (isHistoryLoading || isHistoryFetching) && historyPoints.length === 0;

  const handleHistoryClick = () => {
    if (!historyEnabled) {
      setHistoryEnabled(true);
    } else {
      refetchHistory();
    }
  };

  return (
    <article 
      className="sensor-card opacity-0 animate-fade-up"
      style={{ animationDelay: `${sensor.id * 80}ms` }}
    >
      {/* Header */}
      <header className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="leaf-badge h-10 w-10">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-foreground">{sensor.sensorName}</h2>
            <p className={`text-sm ${isStale ? 'status-stale font-medium' : 'text-muted-foreground'}`}>
              {isStale && "⚠ "}{timeAgo}
            </p>
          </div>
        </div>
      </header>

      {/* Temperature - Main display */}
      <div className="mb-8">
        <div className="flex items-baseline">
          <span className="temperature-display">
            {sensor.temperature.toFixed(1)}
          </span>
          <span className="temperature-unit">°C</span>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto px-0 text-sm font-medium text-foreground"
            onClick={handleHistoryClick}
            disabled={isHistoryLoading || isHistoryFetching}
          >
            Évolution sur 24h
          </Button>
        </div>

        {historyEnabled && (
          <TemperatureHistoryChart
            sensorName={sensor.sensorName}
            history={historyPoints}
            isLoading={showHistorySpinner}
            isIdle={isHistoryIdle}
            isError={isHistoryError}
          />
        )}
      </div>

      {/* Secondary metrics */}
      <footer className="flex flex-wrap gap-2">
        {sensor.humidity !== undefined && (
          <div className="metric-pill">
            <Droplets className="h-4 w-4 text-ocean" />
            <span>{sensor.humidity}%</span>
          </div>
        )}
        
        <div className="metric-pill">
          <Gauge className="h-4 w-4 text-terracotta" />
          <span>{sensor.pression.toFixed(0)} hPa</span>
        </div>

      </footer>
    </article>
  );
};

export default SensorCard;
