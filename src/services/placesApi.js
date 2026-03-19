export async function searchPlaces(query) {
  const res = await fetch(`/.netlify/functions/place-search?query=${encodeURIComponent(query)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.results || [];
}

export async function getPlaceDetails(placeId) {
  const res = await fetch(`/.netlify/functions/place-details?place_id=${encodeURIComponent(placeId)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}
