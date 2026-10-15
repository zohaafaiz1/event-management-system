
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchEvents } from "../services/ticketmaster";

function Events() {
  const [events, setEvents] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
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
          keyword: search,
          classificationName: category,
          page: page,
        });

        if (!cancelled) {
          setEvents(result.events);
          setTotalPages(result.totalPages);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setEvents([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, [search, category, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setSearch(keyword.trim());
  };

  return (
    <div className="events-page">

      <div className="hero">
        <h1>Discover Your Next Experience</h1>
        <p>
          Explore concerts, sports, arts and exciting events.
        </p>
      </div>

      <form className="filters" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search events..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(0);
          }}
        >
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Arts & Theatre">Arts & Theatre</option>
          <option value="Family">Family</option>
        </select>

        <button type="submit">
          Search
        </button>
      </form>

      {loading && (
        <p className="loading">Loading events...</p>
      )}

      {error && (
        <p className="error">
          Error: {error}
        </p>
      )}

      {!loading && !error && events.length === 0 && (
        <p>No events found. Try another search.</p>
      )}

      {!loading && !error && events.length > 0 && (
        <>
          <div className="events-grid">
            {events.map((event) => {
              const image =
                event.images?.find(
                  (img) => img.ratio === "16_9"
                )?.url ||
                event.images?.[0]?.url;

              const venue =
                event._embedded?.venues?.[0];

              const date =
                event.dates?.start?.localDate || "TBA";

              const city =
                venue?.city?.name || "Location TBA";

              const eventCategory =
                event.classifications?.[0]?.segment?.name ||
                "Event";

              return (
                <div className="event-card" key={event.id}>

                  {image && (
                    <img
                      src={image}
                      alt={event.name}
                      loading="lazy"
                    />
                  )}

                  <div className="event-card-content">

                    <span className="event-category">
                      {eventCategory}
                    </span>

                    <h3>{event.name}</h3>

                    <p>📅 {date}</p>

                    <p>📍 {city}</p>

                    <Link to={`/events/${event.id}`}>
                      View Details →
                    </Link>

                  </div>
                </div>
              );
            })}
          </div>

          <div className="pagination">

            <button
              type="button"
              disabled={page === 0}
              onClick={() =>
                setPage((prev) => Math.max(0, prev - 1))
              }
            >
              Previous
            </button>

            <span>
              Page {page + 1} of {totalPages || 1}
            </span>

            <button
              type="button"
              disabled={page + 1 >= totalPages}
              onClick={() =>
                setPage((prev) => prev + 1)
              }
            >
              Next
            </button>

          </div>
        </>
      )}
    </div>
  );
}

export default Events;
