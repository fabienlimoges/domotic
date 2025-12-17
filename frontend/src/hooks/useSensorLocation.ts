import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

type UpdateSensorLocationPayload = {
  sensorName: string;
  location: string;
};

const updateSensorLocation = async (payload: UpdateSensorLocationPayload) => {
  const response = await fetch("/sensor/location", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update sensor location");
  }

  return response.json();
};

export const useSensorLocation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateSensorLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sensorData"] });
      queryClient.invalidateQueries({ queryKey: ["temperatureHistory"] });
      toast({
        title: "Emplacement sauvegardé",
        description: "Le lieu du capteur a été mis à jour.",
      });
    },
    onError: () => {
      toast({
        title: "Impossible de sauvegarder",
        description: "Veuillez vérifier votre connexion ou réessayer plus tard.",
        variant: "destructive",
      });
    },
  });
};
