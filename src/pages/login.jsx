
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";
import { loginUser, clearError } from "../features/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  if (user) {
    setTimeout(() => navigate("/"), 0);
  }

  return (
    <div className="auth-card">
      <h1>Welcome Back</h1>
      <p>Login to manage your events.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/register" onClick={() => dispatch(clearError())}>Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;
