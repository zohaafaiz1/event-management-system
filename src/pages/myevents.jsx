
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
import { useSelector } from "react-redux";
import {
  getUserRegistrations,
  cancelRegistration,
} from "../services/registrations";

function MyEvents() {
  const user = useSelector((state) => state.auth.user);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    if (user) {
      setRegistrations(getUserRegistrations(user.id));
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleCancel = (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this registration?"
    );

    if (!confirmed) return;

    cancelRegistration(user.id, eventId);
    setRegistrations(getUserRegistrations(user.id));
  };

  return (
    <div className="container">
      <h1>My Events</h1>
      <p>Manage your registered events here.</p>

      {registrations.length === 0 ? (
        <div className="empty-state">
          <h2>No Registered Events</h2>
          <p>You haven't registered for any events yet.</p>
          <Link to="/">Explore Events</Link>
        </div>
      ) : (
        <div className="events-grid">
          {registrations.map((registration) => (
            <div className="event-card" key={registration.eventId}>
              {registration.eventImage && (
                <img
                  src={registration.eventImage}
                  alt={registration.eventName}
                />
              )}

              <div className="event-card-content">
                <h3>{registration.eventName}</h3>
                <p>Date: {registration.eventDate}</p>
                <p>Venue: {registration.venue}</p>

                <Link to={`/events/${registration.eventId}`}>
                  View Details
                </Link>

                <div className="cancel-action">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => handleCancel(registration.eventId)}
                  >
                    Cancel Registration
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEvents;
