
import { createSlice } from "@reduxjs/toolkit";

const savedUser = JSON.parse(localStorage.getItem("currentUser") || "null");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser,
    error: null,
  },
  reducers: {
    registerUser: (state, action) => {
      const { name, email, password } = action.payload;
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      if (users.some((u) => u.email === email.toLowerCase())) {
        state.error = "Email already registered!";
        return;
      }

      // Demo-only credential check. Never store real passwords here.
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email: email.toLowerCase(),
      };

      users.push({ ...newUser, password });
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      state.user = newUser;
      state.error = null;
    },

    loginUser: (state, action) => {
      const { email, password } = action.payload;
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      const found = users.find(
        (u) => u.email === email.toLowerCase() && u.password === password
      );

      if (!found) {
        state.error = "Invalid email or password!";
        return;
      }

      const { password: _password, ...safeUser } = found;
      localStorage.setItem("currentUser", JSON.stringify(safeUser));

      state.user = safeUser;
      state.error = null;
    },

    logoutUser: (state) => {
      localStorage.removeItem("currentUser");
      state.user = null;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  registerUser,
  loginUser,
  logoutUser,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
