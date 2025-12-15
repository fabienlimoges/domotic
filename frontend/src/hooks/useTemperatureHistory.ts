import { useQuery } from "@tanstack/react-query";
import { SensorMeasure } from "@/types/sensor";

const fetchTemperatureHistory = async (
  sensorName: string,
  hours: number,
): Promise<SensorMeasure[]> => {
  const params = new URLSearchParams({ hours: hours.toString() });
  const response = await fetch(
    `/sensor/measure/history/${encodeURIComponent(sensorName)}?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch temperature history");
  }

  return response.json();
};

export const useTemperatureHistory = (
  sensorName: string,
  hours = 24,
  enabled = false,
) => {
  return useQuery({
    queryKey: ["temperatureHistory", sensorName, hours],
    queryFn: () => fetchTemperatureHistory(sensorName, hours),
    enabled: Boolean(sensorName) && enabled,
    staleTime: 60_000,
    refetchInterval: enabled ? 60_000 : false,
  });
};

export const buildMockHistory = (baseTemperature: number): SensorMeasure[] => {
  const now = Date.now();

  return Array.from({ length: 12 }, (_, index) => {
    const timestamp = new Date(now - (11 - index) * 2 * 60 * 60 * 1000);
    const tempVariation = Math.sin(index / 2) * 1.2;

    return {
      id: index + 1,
      sensorName: "Mock",
      temperature: parseFloat((baseTemperature + tempVariation).toFixed(1)),
      pression: 1013,
      measuredAt: timestamp.toISOString(),
    };
  });
};
