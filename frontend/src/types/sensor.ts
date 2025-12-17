export interface SensorMeasure {
  id: number;
  sensorName: string;
  location?: string | null;
  temperature: number;
  pression: number;
  altitude?: number | null;
  humidity?: number;
  measuredAt?: string | number;
}

export interface SensorCardProps {
  sensor: SensorMeasure;
  staleThresholdMinutes?: number;
}
