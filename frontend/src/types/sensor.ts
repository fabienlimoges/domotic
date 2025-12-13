export interface SensorMeasure {
  id: number;
  sensorName: string;
  temperature: number;
  pression: number;
  altitude: number;
  humidity?: number;
  measuredAt?: string;
}

export interface SensorCardProps {
  sensor: SensorMeasure;
  staleThresholdMinutes?: number;
}
