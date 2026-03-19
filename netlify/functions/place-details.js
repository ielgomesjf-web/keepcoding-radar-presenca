const FIELD_MASK = [
  "id", "displayName", "formattedAddress", "shortFormattedAddress",
  "nationalPhoneNumber", "internationalPhoneNumber", "websiteUri",
  "regularOpeningHours", "primaryType", "primaryTypeDisplayName",
  "types", "rating", "userRatingCount", "reviews", "photos",
  "editorialSummary", "location", "businessStatus", "googleMapsUri",
  "addressComponents",
].join(",");

let requestCount = 0;
let windowStart = Date.now();

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders() };
  }

  // Rate limit: 60 req/min
  const now = Date.now();
  if (now - windowStart > 60000) {
    requestCount = 0;
    windowStart = now;
  }
  requestCount++;
  if (requestCount > 60) {
    return respond(429, { error: 'Rate limit excedido. Tente novamente em 1 minuto.' });
  }

  const placeId = event.queryStringParameters?.place_id;
  if (!placeId) {
    return respond(400, { error: 'Parametro place_id obrigatorio.' });
  }

  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  if (!API_KEY) {
    return respond(500, { error: 'API key nao configurada no servidor.' });
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    const res = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': FIELD_MASK,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return respond(502, { error: err.error?.message || `Google API retornou ${res.status}` });
    }

    const data = await res.json();
    return respond(200, data);
  } catch (err) {
    return respond(502, { error: `Falha ao consultar Google API: ${err.message}` });
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };
}

function respond(statusCode, body) {
  return {
    statusCode,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
