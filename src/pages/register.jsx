
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { registerUser, clearError } from "../features/authSlice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    dispatch(registerUser({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    }));
  };

  return (
    <div className="auth-card">
      <h1>Create Account</h1>
      <p>Join EventHub and discover amazing events.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          required
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email Address"
          required
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password (minimum 6 characters)"
          minLength={6}
          required
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Create Account</button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
