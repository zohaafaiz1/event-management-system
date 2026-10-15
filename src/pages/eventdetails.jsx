
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

      try {
        const data = await fetchEventById(id);
        if (!cancelled) setEvent(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadEvent();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!event) return <p>Event not found.</p>;

  const venue = event._embedded?.venues?.[0];
  const image = event.images?.find(
    (img) => img.ratio === "16_9"
  )?.url || event.images?.[0]?.url;

  return (
    <div className="event-details">
      <Link to="/">← Back to Events</Link>

      {image && <img src={image} alt={event.name} />}

      <h1>{event.name}</h1>

      <p>📅 Date: {event.dates?.start?.localDate || "TBA"}</p>
      <p>🕒 Time: {event.dates?.start?.localTime || "TBA"}</p>
      <p>🏟️ Venue: {venue?.name || "TBA"}</p>
      <p>📍 City: {venue?.city?.name || "TBA"}</p>
      <p>🌍 Country: {venue?.country?.name || "TBA"}</p>
      <p>
        🎭 Category:{" "}
        {event.classifications?.[0]?.segment?.name || "Event"}
      </p>

      {event.info && <p>{event.info}</p>}

      <button disabled>
        Registration Coming Soon
      </button>
    </div>
  );
}

export default EventDetails;
