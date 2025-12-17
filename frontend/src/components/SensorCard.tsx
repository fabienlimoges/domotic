import { useEffect, useMemo, useState } from "react";
import { SensorCardProps } from "@/types/sensor";
import { Check, Droplets, Gauge, Leaf, Loader2, MapPin, Pencil, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import TemperatureHistoryChart from "@/components/TemperatureHistoryChart";
import { buildMockHistory, useTemperatureHistory } from "@/hooks/useTemperatureHistory";
import { parseMeasuredAt } from "@/lib/parseMeasuredAt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSensorLocation } from "@/hooks/useSensorLocation";
import { useToast } from "@/components/ui/use-toast";

const SensorCard = ({ sensor, staleThresholdMinutes = 60 }: SensorCardProps) => {
  const measureDate = parseMeasuredAt(sensor.measuredAt);
  const isStale = measureDate
    ? (Date.now() - measureDate.getTime()) > staleThresholdMinutes * 60 * 1000
    : false;

  const timeAgo = measureDate
    ? formatDistanceToNow(measureDate, { addSuffix: true, locale: fr })
    : "Date inconnue";

  const [historyEnabled, setHistoryEnabled] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState(sensor.location ?? "");
  const locationLabel = sensor.location ?? sensor.sensorName;
  const { toast } = useToast();
  const {
    mutate: saveLocation,
    isPending: isSavingLocation,
  } = useSensorLocation();

  const {
    data: history,
    isLoading: isHistoryLoading,
    isFetching: isHistoryFetching,
    isError: isHistoryError,
    isIdle: isHistoryIdle,
    refetch: refetchHistory,
  } = useTemperatureHistory(locationLabel, 24, historyEnabled);

  const historyPoints = useMemo(
    () => (isHistoryError ? buildMockHistory(sensor.temperature, locationLabel) : history ?? []),
    [history, isHistoryError, locationLabel, sensor.temperature],
  );
  const showHistorySpinner = (isHistoryLoading || isHistoryFetching) && historyPoints.length === 0;

  const handleHistoryClick = () => {
    if (!historyEnabled) {
      setHistoryEnabled(true);
    } else {
      refetchHistory();
    }
  };

  const handleSaveLocation = () => {
    const trimmedLocation = locationInput.trim();

    if (!trimmedLocation) {
      toast({
        title: "Lieu manquant",
        description: "Veuillez saisir un lieu pour le capteur.",
        variant: "destructive",
      });
      return;
    }

    saveLocation(
      { sensorName: sensor.sensorName, location: trimmedLocation },
      {
        onSuccess: () => {
          setIsEditingLocation(false);
        },
      },
    );
  };

  useEffect(() => {
    setLocationInput(sensor.location ?? "");
  }, [sensor.location]);

  const renderLocationEditor = () => {
    if (!isEditingLocation) {
      return (
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-foreground">{locationLabel || "Définir lieu"}</h2>
          <p className="text-sm text-muted-foreground">{sensor.sensorName}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsEditingLocation(true)}
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={locationInput}
          onChange={(event) => setLocationInput(event.target.value)}
          placeholder="Salon, Chambre, Bureau..."
          className="h-9 min-w-[12rem] flex-1"
        />
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            className="h-9"
            onClick={handleSaveLocation}
            disabled={isSavingLocation}
          >
            {isSavingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setIsEditingLocation(false)}
            disabled={isSavingLocation}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <article 
      className="sensor-card animate-fade-up"
      //style={{ animationDelay: `${sensor.id * 80}ms` }}
    >
      {/* Header */}
      <header className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="leaf-badge h-10 w-10">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            {/* <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-medium text-foreground">{locationLabel}</h2>
            </div> */}
            {renderLocationEditor()}
         
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
           <p className={`text-sm ${isStale ? 'status-stale font-medium' : 'text-muted-foreground'}`}>
              {isStale && "⚠ "}{timeAgo}
            </p>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto px-1 text-sm font-medium text-foreground"
            onClick={handleHistoryClick}
            disabled={isHistoryLoading || isHistoryFetching}
          >
            Évolution sur 24h
          </Button>
        </div>

        {historyEnabled && (
          <TemperatureHistoryChart
            sensorName={locationLabel}
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
