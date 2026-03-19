const FIELD_MASK = [
  "id", "displayName", "formattedAddress", "shortFormattedAddress",
  "nationalPhoneNumber", "internationalPhoneNumber", "websiteUri",
  "regularOpeningHours", "primaryType", "primaryTypeDisplayName",
  "types", "rating", "userRatingCount", "reviews", "photos",
  "editorialSummary", "location", "businessStatus", "googleMapsUri",
  "addressComponents",
].join(",");

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(204).end();
  }

  const placeId = req.query.place_id;
  if (!placeId) {
    return res.status(400).json({ error: 'Parametro place_id obrigatorio.' });
  }

  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key nao configurada no servidor.' });
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    const response = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': FIELD_MASK,
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(502).json({ error: err.error?.message || `Google API retornou ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: `Falha ao consultar Google API: ${err.message}` });
  }
}
