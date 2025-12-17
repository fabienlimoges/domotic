import { useSensorData } from "@/hooks/useSensorData";
import SensorCard from "./SensorCard";
import { Leaf, RefreshCw, CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const SensorDashboard = () => {
  const { data, isError, refetch, isFetching } = useSensorData();

  // Use mock data when available, but never show it on errors
  const sensors = isFetching ? [] : data ;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-5 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf-light">
              <Leaf className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-display font-medium text-foreground">Ma Maison</h1>
              <p className="text-xs text-muted-foreground">
                {sensors.length} capteur{sensors.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 w-9 rounded-full hover:bg-muted"
          >
            <RefreshCw className={`h-4 w-4 text-muted-foreground ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </header>

      <main className="px-5 py-6 max-w-lg mx-auto">
        {/* Error state */}
        {isError && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3">
            <CloudOff className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Connexion impossible</p>
          </div>
        )}

        {/* Loading state */}
        {isFetching && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="h-44 rounded-3xl bg-card border border-border animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Sensor cards */}
        { sensors.length > 0 && (
          <div className="flex flex-col gap-4">
            {sensors.map((sensor) => (
              <SensorCard key={sensor.id} sensor={sensor} staleThresholdMinutes={60} />
            ))}
          </div>
        )}

        {/* Empty state */}
        { sensors.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Leaf className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="mb-1 text-lg font-display font-medium text-foreground">Aucun capteur</h2>
            <p className="text-sm text-muted-foreground">
              Aucune mesure disponible
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SensorDashboard;
