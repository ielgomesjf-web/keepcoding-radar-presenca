export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders() };
  }

  const query = event.queryStringParameters?.query;
  if (!query || query.trim().length < 3) {
    return respond(400, { error: 'Parametro query obrigatorio (minimo 3 caracteres).' });
  }

  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  if (!API_KEY) {
    return respond(500, { error: 'API key nao configurada no servidor.' });
  }

  try {
    const url = 'https://places.googleapis.com/v1/places:searchText';
    const res = await fetch(url, {
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

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return respond(502, { error: err.error?.message || `Google API retornou ${res.status}` });
    }

    const data = await res.json();
    const results = (data.places || []).map(p => ({
      place_id: p.id,
      name: p.displayName?.text || '',
      address: p.formattedAddress || '',
      category: p.primaryTypeDisplayName?.text || '',
      rating: p.rating || null,
      reviews: p.userRatingCount || 0,
    }));

    return respond(200, { results });
  } catch (err) {
    return respond(502, { error: `Falha ao consultar Google API: ${err.message}` });
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
}

function respond(statusCode, body) {
  return {
    statusCode,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
