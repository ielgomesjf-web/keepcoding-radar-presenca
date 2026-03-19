import { useEffect, useRef, useState } from 'react';
import { Search, Loader } from 'lucide-react';

export default function SearchBar({ onSelect, loading }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function init() {
      if (!window.google?.maps?.places) {
        setTimeout(init, 300);
        return;
      }
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'br' },
        fields: ['place_id', 'name', 'formatted_address'],
      });
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place?.place_id) {
          onSelect(place.place_id, place.name);
        }
      });
      setReady(true);
    }
    init();
  }, [onSelect]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray pointer-events-none">
        {loading ? <Loader size={20} className="animate-spin" /> : <Search size={20} />}
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Digite o nome ou endereco do negocio..."
        disabled={loading}
        className="w-full pl-12 pr-4 py-4 text-base rounded-xl border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all disabled:opacity-60"
      />
    </div>
  );
}
