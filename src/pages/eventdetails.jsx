
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { fetchEventById } from "../services/ticketmaster";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadEvent() {
      setLoading(true);
      setError("");
      setEvent(null);

      try {
        const data = await fetchEventById(id);

        if (!cancelled) {
          setEvent(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEvent();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="event-details">
        <p className="loading">Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-details">
        <p className="error">Error: {error}</p>
        <Link to="/">← Back to Events</Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details">
        <p>Event not found.</p>
        <Link to="/">← Back to Events</Link>
      </div>
    );
  }

  const venue = event._embedded?.venues?.[0];

  const image =
    event.images?.find((img) => img.ratio === "16_9")?.url ||
    event.images?.[0]?.url;

  const rawDate = event.dates?.start?.localDate;

  const date = rawDate
    ? new Date(`${rawDate}T00:00:00`).toLocaleDateString(
        "en-US",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "TBA";

  const rawTime = event.dates?.start?.localTime;

  const time = rawTime
    ? new Date(`2000-01-01T${rawTime}`).toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      )
    : "TBA";

  const category =
    event.classifications?.[0]?.segment?.name || "Event";

  return (
    <div className="event-details">
      <Link to="/">← Back to Events</Link>

      {image && (
        <img src={image} alt={event.name} />
      )}

      <span className="event-category">{category}</span>

      <h1>{event.name}</h1>

      <h2>Event Information</h2>

      <p>📅 Date: {date}</p>
      <p>🕒 Time: {time}</p>
      <p>🏟️ Venue: {venue?.name || "TBA"}</p>
      <p>📍 City: {venue?.city?.name || "TBA"}</p>
      <p>🌍 Country: {venue?.country?.name || "TBA"}</p>

      {(event.info || event.pleaseNote) && (
        <>
          <h2>About This Event</h2>

          {event.info && <p>{event.info}</p>}

          {event.pleaseNote && (
            <p>{event.pleaseNote}</p>
          )}
        </>
      )}

      {event.url && (
        <p>
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Ticketmaster ↗
          </a>
        </p>
      )}

      <button type="button" disabled>
        Registration Coming Soon
      </button>
    </div>
  );
}

export default EventDetails;
