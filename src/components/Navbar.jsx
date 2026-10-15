
import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>EventHub</h2>

      <div className="nav-links">
        <NavLink to="/">Events</NavLink>

        {user ? (
          <>
            <NavLink to="/my-events">My Events</NavLink>
            <span>Hi, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
