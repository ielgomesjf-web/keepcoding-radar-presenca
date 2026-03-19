const FUNCTION_URL = '/.netlify/functions/place-details';

export async function getPlaceDetails(placeId) {
  const res = await fetch(`${FUNCTION_URL}?place_id=${encodeURIComponent(placeId)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}
