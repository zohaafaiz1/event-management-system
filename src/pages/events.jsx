import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchEvents } from "../services/ticketmaster";

const categories = ["All Events", "Music", "Sports", "Arts & Theatre", "Film", "Miscellaneous"];

function EventImage({ event }) {
  const images = event.images || [];
  const preferred = images.find((img) => img.ratio === "16_9" && img.width >= 640)
    || images.find((img) => img.ratio === "16_9") || images[0];
  const [imageUrl, setImageUrl] = useState(preferred?.url || "");

  useEffect(() => {
    setImageUrl(preferred?.url || "");
  }, [event.id, preferred?.url]);

  return (
    <div className="event-image" style={{ height: 190, overflow: "hidden" }}>
      {imageUrl ? (
        <img src={imageUrl} alt={event.name} onError={() => setImageUrl("")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ height: "100%", display: "flex", alignItems: "center",
          justifyContent: "center", padding: 16, textAlign: "center", color: "white",
          background: "linear-gradient(135deg, #312e81, #581c87)" }}>
          EventHub
        </div>
      )}
    </div>
  );
}

function Events() {
  const [events, setEvents] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Events");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadEvents() {
      setLoading(true);
      setError("");
      try {
        const result = await fetchEvents({
          keyword: searchTerm,
          classificationName: category === "All Events" ? "" : category,
          page,
        });
        if (!cancelled) {
          setEvents(result.events || []);
          setTotalPages(result.totalPages || 0);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load events.");
          setEvents([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadEvents();
    return () => { cancelled = true; };
  }, [searchTerm, category, page]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(0);
    setSearchTerm(keyword.trim());
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Discover Events</h1>
        <p>Explore concerts, sports, theatre and more.</p>
      </div>
      <div className="events-filters">
        <form onSubmit={handleSearch}>
          <input type="text" placeholder="Search events..." value={keyword}
            onChange={(e) => setKeyword(e.target.value)} />
          <button type="submit">Search</button>
        </form>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(0); }}>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      {loading && <p className="loading">Loading events...</p>}
      {error && <p className="error">Error: {error}</p>}
      {!loading && !error && events.length === 0 && <p>No events found. Try another search.</p>}
      {!loading && !error && (
        <>
          <div className="events-grid">
            {events.map((event) => {
              const rawDate = event.dates?.start?.localDate;
              const date = rawDate ? new Date(`${rawDate}T00:00:00`).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric"
              }) : "TBA";
              const venue = event._embedded?.venues?.[0];
              const eventCategory = event.classifications?.[0]?.segment?.name || "Event";
              return (
                <div className="event-card" key={event.id}>
                  <EventImage event={event} />
                  <div className="event-card-content">
                    <span className="event-category">{eventCategory}</span>
                    <h3>{event.name}</h3>
                    <p>Date: {date}</p>
                    <p>Venue: {venue?.name || "TBA"}</p>
                    <p>City: {venue?.city?.name || "TBA"}</p>
                    <Link to={`/events/${event.id}`}>View Details</Link>
                  </div>
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div className="pagination" style={{ display: "flex", justifyContent: "center",
              alignItems: "center", gap: 16, marginTop: 30 }}>
              <button type="button" disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}>Previous</button>
              <span>Page {page + 1} of {totalPages}</span>
              <button type="button" disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Events;
