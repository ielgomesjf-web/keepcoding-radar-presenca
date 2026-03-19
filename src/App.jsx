import { useState, useCallback } from 'react';
import { Radar, Shield } from 'lucide-react';
import SearchBar from './components/SearchBar';
import DiagnosticResult from './components/DiagnosticResult';
import { getPlaceDetails } from './services/placesApi';

export default function App() {
  const [state, setState] = useState('search');
  const [placeData, setPlaceData] = useState(null);
  const [error, setError] = useState('');

  const handleSelect = useCallback(async (placeId) => {
    setState('loading');
    setError('');
    try {
      const data = await getPlaceDetails(placeId);
      setPlaceData(data);
      setState('result');
    } catch (err) {
      setError(err.message || 'Erro ao buscar dados do negocio.');
      setState('error');
    }
  }, []);

  function handleReset() {
    setState('search');
    setPlaceData(null);
    setError('');
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
              <Radar size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg leading-tight">Radar Presenca</h1>
              <p className="text-[11px] text-gray leading-tight">KeepCoding / GRZ</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray">
            <Shield size={14} />
            <span className="hidden sm:inline">Google Risco Zero</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {state === 'search' && (
          <div className="flex flex-col items-center gap-6 pt-12 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center">
              <Radar size={32} className="text-brand" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Diagnostico do Google Meu Negocio</h2>
              <p className="text-gray mt-2 max-w-md mx-auto text-sm">
                Analise a saude do perfil Google Meu Negocio de qualquer empresa e receba um score de 0 a 100 com plano de acao.
              </p>
            </div>
            <SearchBar onSelect={handleSelect} loading={false} />
          </div>
        )}

        {state === 'loading' && (
          <div className="flex flex-col items-center gap-4 pt-24 animate-fade-in">
            <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
            <p className="text-gray font-medium">Analisando perfil...</p>
            <p className="text-sm text-gray/70">Consultando Google Places API</p>
          </div>
        )}

        {state === 'error' && (
          <div className="flex flex-col items-center gap-4 pt-16 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-danger/10 flex items-center justify-center text-2xl">&#9888;</div>
            <p className="text-danger font-medium text-center">{error}</p>
            <button onClick={handleReset}
              className="text-sm text-brand hover:underline cursor-pointer">
              Tentar novamente
            </button>
          </div>
        )}

        {state === 'result' && placeData && (
          <DiagnosticResult placeData={placeData} onReset={handleReset} />
        )}
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-3xl mx-auto px-6 py-4 text-center text-xs text-gray">
          Diagnostico gerado por GRZ — Google Risco Zero | keepcoding.net.br
        </div>
      </footer>
    </div>
  );
}
