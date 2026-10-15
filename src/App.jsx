import { Routes, Route } from "react-router";

import Navbar from "./components/Navbar";
import Events from "./pages/events";
import Login from "./pages/login";
import Register from "./pages/register";
import MyEvents from "./pages/myevents";
import EventDetails from "./pages/eventdetails";

function App() {
  return (
    <>
      <Navbar />

      <main className="container">
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/events/:id" element={<EventDetails />} />
        </Routes>
      </main>
    </>
  );
}

export default App;