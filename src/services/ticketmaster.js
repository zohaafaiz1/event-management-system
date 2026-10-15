
const BASE_URL = "https://app.ticketmaster.com/discovery/v2";
const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;

export async function fetchEvents({
  keyword = "",
  classificationName = "",
  page = 0,
} = {}) {
  if (!API_KEY) {
    throw new Error("Ticketmaster API key is missing.");
  }

  const params = new URLSearchParams({
    apikey: API_KEY,
    size: "20",
    page: String(page),
    sort: "date,asc",
  });

  if (keyword.trim()) {
    params.set("keyword", keyword.trim());
  }

  if (classificationName) {
    params.set("classificationName", classificationName);
  }

  const response = await fetch(
    `${BASE_URL}/events.json?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to load events (${response.status})`);
  }

  const data = await response.json();

  return {
    events: data._embedded?.events || [],
    totalPages: data.page?.totalPages || 0,
  };
}

export async function fetchEventById(id) {
  if (!API_KEY) {
    throw new Error("Ticketmaster API key is missing.");
  }

  const response = await fetch(
    `${BASE_URL}/events/${encodeURIComponent(id)}.json?apikey=${encodeURIComponent(API_KEY)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to load event (${response.status})`);
  }

  return response.json();
}
