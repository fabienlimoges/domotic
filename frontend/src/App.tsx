import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

type SensorMeasure = {
  id: number;
  sensorName: string;
  temperature: number;
  pression: number;
  altitude: number;
  humidity: number | null;
  timestamp: string | null;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;

async function fetchLastMeasures(): Promise<SensorMeasure[]> {
  const response = await fetch(`${API_BASE_URL}/sensor/measure/last`);

  if (!response.ok) {
    throw new Error('Impossible de récupérer les mesures.');
  }

  return response.json();
}

function formatTimestamp(value: string | null): string {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

function MeasureCard({ measure }: { measure: SensorMeasure }) {
  const stats = useMemo(
    () => [
      { label: 'Température', value: `${measure.temperature.toFixed(1)} °C` },
      { label: 'Pression', value: `${measure.pression.toFixed(1)} hPa` },
      { label: 'Altitude', value: `${measure.altitude.toFixed(1)} m` },
      {
        label: 'Humidité',
        value: measure.humidity !== null ? `${measure.humidity.toFixed(1)} %` : 'N/A',
      },
      { label: 'Horodatage', value: formatTimestamp(measure.timestamp) },
    ],
    [measure]
  );

  return (
    <article className="rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <header className="border-b border-slate-100 px-4 py-3">
        <p className="text-sm text-slate-500">Capteur</p>
        <h2 className="text-xl font-semibold text-slate-900">{measure.sensorName}</h2>
      </header>
      <dl className="px-4 py-4 space-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col">
            <dt className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</dt>
            <dd className="text-lg font-medium text-slate-900">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function App() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['lastMeasures'],
    queryFn: fetchLastMeasures,
    refetchInterval: 30000,
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Domotic</p>
            <h1 className="text-3xl font-bold text-slate-900">Mesures les plus récentes</h1>
            <p className="mt-1 text-slate-600">Affichage vertical des dernières valeurs enregistrées pour chaque capteur.</p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus-visible:ring focus-visible:ring-indigo-200"
            disabled={isRefetching}
          >
            {isRefetching ? 'Actualisation...' : 'Rafraîchir'}
          </button>
        </header>

        <section className="space-y-4">
          {isLoading && <p className="text-slate-600">Chargement des mesures...</p>}

          {isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
              {(error as Error).message}
            </div>
          )}

          {data && data.length === 0 && !isLoading && (
            <p className="text-slate-600">Aucune mesure enregistrée pour le moment.</p>
          )}

          {data && data.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {data.map((measure) => (
                <MeasureCard key={measure.id} measure={measure} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
