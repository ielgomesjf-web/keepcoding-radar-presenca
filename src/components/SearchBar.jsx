import { useState } from 'react';
import { Search, Loader, MapPin, Star } from 'lucide-react';
import { searchPlaces } from '../services/placesApi';

export default function SearchBar({ onSelect, loading }) {
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [buscou, setBuscou] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!nome.trim()) return;
    setBuscando(true);
    setBuscou(false);
    setResultados([]);
    try {
      const query = cidade.trim() ? `${nome.trim()} ${cidade.trim()}` : nome.trim();
      const results = await searchPlaces(query);
      setResultados(results);
      setBuscou(true);
    } catch (err) {
      console.error(err);
      setBuscou(true);
    }
    setBuscando(false);
  }

  function handleSelectResult(result) {
    setResultados([]);
    setBuscou(false);
    onSelect(result.place_id);
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray pointer-events-none">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Nome da empresa..."
            disabled={loading || buscando}
            className="w-full pl-11 pr-4 py-3.5 text-base rounded-xl border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all disabled:opacity-60"
          />
        </div>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray pointer-events-none">
            <MapPin size={18} />
          </div>
          <input
            type="text"
            value={cidade}
            onChange={e => setCidade(e.target.value)}
            placeholder="Cidade (ex: Sao Paulo)"
            disabled={loading || buscando}
            className="w-full pl-11 pr-4 py-3.5 text-base rounded-xl border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all disabled:opacity-60"
          />
        </div>
        <button type="submit" disabled={loading || buscando || !nome.trim()}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50 cursor-pointer shadow-sm">
          {buscando ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
          {buscando ? 'Buscando...' : 'Buscar Negocio'}
        </button>
      </form>

      {/* Resultados da busca */}
      {buscou && resultados.length > 0 && (
        <div className="mt-4 bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
          <p className="px-4 py-2.5 text-xs text-gray bg-gray-50 border-b border-border font-medium">
            {resultados.length} resultado(s) encontrado(s) — selecione o negocio:
          </p>
          {resultados.map((r, i) => (
            <button key={r.place_id}
              onClick={() => handleSelectResult(r)}
              disabled={loading}
              className={`w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-brand/5 transition-colors cursor-pointer ${
                i < resultados.length - 1 ? 'border-b border-border/50' : ''
              }`}>
              <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={16} className="text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{r.name}</p>
                <p className="text-xs text-gray mt-0.5 truncate">{r.address}</p>
                {r.category && <span className="inline-block text-[11px] bg-brand/10 text-brand px-1.5 py-0.5 rounded mt-1">{r.category}</span>}
              </div>
              {r.rating && (
                <div className="flex items-center gap-1 shrink-0 text-xs text-gray">
                  <Star size={12} className="text-warning fill-warning" />
                  <span className="font-medium">{r.rating}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {buscou && resultados.length === 0 && !buscando && (
        <div className="mt-4 bg-card rounded-xl border border-border shadow-sm p-4 text-center animate-fade-in">
          <p className="text-sm text-gray">Nenhum negocio encontrado. Tente outro nome ou adicione a cidade.</p>
        </div>
      )}
    </div>
  );
}
