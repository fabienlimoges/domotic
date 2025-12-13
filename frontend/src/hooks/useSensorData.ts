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

// Mock data for development/demo
export const mockSensorData: SensorMeasure[] = [
  {
    id: 1,
    sensorName: "Salon",
    temperature: 21.5,
    pression: 1013.25,
    altitude: 150,
    humidity: 45,
    measuredAt: new Date().toISOString(),
  },
  {
    id: 2,
    sensorName: "Chambre",
    temperature: 19.8,
    pression: 1013.20,
    altitude: 150,
    humidity: 52,
    measuredAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 3,
    sensorName: "Cuisine",
    temperature: 22.3,
    pression: 1013.30,
    altitude: 150,
    humidity: 58,
    measuredAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2h ago - stale
  },
  {
    id: 4,
    sensorName: "Bureau",
    temperature: 23.1,
    pression: 1013.28,
    altitude: 150,
    humidity: 40,
    measuredAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
];
