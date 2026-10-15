
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";

import { fetchEventById } from "../services/ticketmaster";

import {
  isEventRegistered,
  registerForEvent,
} from "../services/registrations";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadEvent() {
      setLoading(true);
      setError("");
      setEvent(null);
      setMessage("");

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

  useEffect(() => {
    if (user && event) {
      setRegistered(
        isEventRegistered(user.id, event.id)
      );
    } else {
      setRegistered(false);
    }
  }, [user, event]);

  const handleRegister = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!event) return;

    try {
      const success = registerForEvent(user.id, event);

      setRegistered(true);

      if (success) {
        setMessage("Registration successful!");
      } else {
        setMessage(
          "You are already registered for this event."
        );
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) {
    return (
      <div className="event-details">
        <p className="loading">
          Loading event details...
        </p>
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
    event.images?.find(
      (img) => img.ratio === "16_9"
    )?.url || event.images?.[0]?.url;

  const rawDate = event.dates?.start?.localDate;

  const date = rawDate
    ? new Date(
        `${rawDate}T00:00:00`
      ).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "TBA";

  const rawTime = event.dates?.start?.localTime;

  const time = rawTime
    ? new Date(
        `2000-01-01T${rawTime}`
      ).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "TBA";

  const category =
    event.classifications?.[0]?.segment?.name ||
    "Event";

  return (
    <div className="event-details">
      <Link to="/">← Back to Events</Link>

      {image && (
        <img src={image} alt={event.name} />
      )}

      <span className="event-category">
        {category}
      </span>

      <h1>{event.name}</h1>

      <h2>Event Information</h2>

      <p>📅 Date: {date}</p>
      <p>🕒 Time: {time}</p>
      <p>🏟️ Venue: {venue?.name || "TBA"}</p>
      <p>📍 City: {venue?.city?.name || "TBA"}</p>
      <p>
        🌍 Country: {venue?.country?.name || "TBA"}
      </p>

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

      <div className="registration-section">
        {message && (
          <p className="registration-message">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={handleRegister}
          disabled={registered}
        >
          {registered
            ? "✓ Already Registered"
            : user
              ? "Register for Event"
              : "Login to Register"}
        </button>
      </div>
    </div>
  );
}

export default EventDetails;
