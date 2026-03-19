import { MapPin, Phone, Globe, Star, ExternalLink } from 'lucide-react';

export default function BusinessHeader({ data }) {
  const name = data.displayName?.text || 'Negocio';
  const address = data.formattedAddress || '';
  const category = data.primaryTypeDisplayName?.text || data.primaryType || '';
  const rating = data.rating;
  const reviews = data.userRatingCount || 0;
  const phone = data.nationalPhoneNumber || data.internationalPhoneNumber || '';
  const website = data.websiteUri || '';
  const mapsUrl = data.googleMapsUri || '';

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 truncate">{name}</h2>
          {category && <span className="inline-block text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full mt-1">{category}</span>}
          {address && (
            <p className="flex items-start gap-1.5 text-sm text-gray mt-2">
              <MapPin size={14} className="shrink-0 mt-0.5" /> {address}
            </p>
          )}
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray">
            {phone && <span className="flex items-center gap-1"><Phone size={13} /> {phone}</span>}
            {website && (
              <a href={website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-brand hover:underline">
                <Globe size={13} /> Website
              </a>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {rating && (
            <div className="flex items-center gap-1.5">
              <Star size={18} className="text-warning fill-warning" />
              <span className="text-xl font-bold">{rating}</span>
              <span className="text-sm text-gray">({reviews})</span>
            </div>
          )}
          {mapsUrl && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-brand hover:underline">
              <ExternalLink size={13} /> Ver no Google Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
