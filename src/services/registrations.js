
const STORAGE_KEY = "eventhub_registrations";

function getAllRegistrations() {
  try {
    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function getUserRegistrations(userId) {
  if (!userId) return [];

  return getAllRegistrations().filter(
    (registration) => registration.userId === userId
  );
}

export function isEventRegistered(userId, eventId) {
  return getUserRegistrations(userId).some(
    (registration) => registration.eventId === eventId
  );
}

export function registerForEvent(userId, event) {
  if (!userId || !event?.id) {
    throw new Error("User and event are required.");
  }

  const registrations = getAllRegistrations();

  const alreadyRegistered = registrations.some(
    (registration) =>
      registration.userId === userId &&
      registration.eventId === event.id
  );

  if (alreadyRegistered) return false;

  registrations.push({
    userId,
    eventId: event.id,
    eventName: event.name,
    eventDate: event.dates?.start?.localDate || "TBA",
    eventImage: event.images?.[0]?.url || "",
    venue: event._embedded?.venues?.[0]?.name || "TBA",
    registeredAt: new Date().toISOString(),
  });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(registrations)
  );

  return true;
}

export function cancelRegistration(userId, eventId) {
  const updated = getAllRegistrations().filter(
    (registration) =>
      !(
        registration.userId === userId &&
        registration.eventId === eventId
      )
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
}
