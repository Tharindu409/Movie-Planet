import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../css/Auth.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/users/register`, {
        name: form.name,
        email: form.email,
        password: form.password
      });

      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="auth-close" onClick={() => navigate("/")}>✕</button>
        
        <div className="auth-left">
          <h2>Sign up</h2>
          
          <form id="register-form" onSubmit={handleSubmit} className="auth-form">
            <div className="input-container">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="auth-input"
                required
              />
            </div>

            <div className="input-container">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className="auth-input"
                required
              />
            </div>

            <div className="input-container">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="auth-input"
                required
              />
              <span className="show-password">Show password</span>
            </div>

            <div className="input-container">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="auth-input"
                required
              />
              <span className="show-password">Show password</span>
            </div>
          </form>
        </div>

        <div className="auth-right">
          <button type="submit" form="register-form" className="auth-button-next">
            Next →
          </button>
          <p className="auth-footer-text">
            Already have an account? <Link to="/login">Log in.</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
