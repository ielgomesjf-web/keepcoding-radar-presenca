export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    return res.status(204).end();
  }

  const query = req.query.query;
  if (!query || query.trim().length < 3) {
    return res.status(400).json({ error: 'Parametro query obrigatorio (minimo 3 caracteres).' });
  }

  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key nao configurada no servidor.' });
  }

  try {
    const url = 'https://places.googleapis.com/v1/places:searchText';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.primaryTypeDisplayName,places.rating,places.userRatingCount',
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: 'pt-BR',
        locationBias: {
          rectangle: {
            low: { latitude: -33.75, longitude: -73.99 },
            high: { latitude: 5.27, longitude: -34.79 },
          },
        },
        maxResultCount: 5,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(502).json({ error: err.error?.message || `Google API retornou ${response.status}` });
    }

    const data = await response.json();
    const results = (data.places || []).map(p => ({
      place_id: p.id,
      name: p.displayName?.text || '',
      address: p.formattedAddress || '',
      category: p.primaryTypeDisplayName?.text || '',
      rating: p.rating || null,
      reviews: p.userRatingCount || 0,
    }));

    return res.status(200).json({ results });
  } catch (err) {
    return res.status(502).json({ error: `Falha ao consultar Google API: ${err.message}` });
  }
}
