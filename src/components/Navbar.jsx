import { NavLink } from "react-router";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>EventHub</h2>

      <div className="nav-links">
        <NavLink to="/">Events</NavLink>
        <NavLink to="/my-events">My Events</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Sign Up</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;