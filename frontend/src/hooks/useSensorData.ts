import { useQuery } from "@tanstack/react-query";
import { SensorMeasure } from "@/types/sensor";

const fetchSensorData = async (): Promise<SensorMeasure[]> => {
  const response = await fetch("/sensor/measure/last");
  if (!response.ok) {
    throw new Error("Failed to fetch sensor data");
  }
  return response.json();
};

export const useSensorData = () => {
  return useQuery({
    queryKey: ["sensorData"],
    queryFn: fetchSensorData,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000,
  });
};