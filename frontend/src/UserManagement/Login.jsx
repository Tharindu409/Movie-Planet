import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../contexts/UserContext";
import "../css/Auth.css";

const Login = () => {
  const { login } = useUserContext();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const googleButtonRef = useRef(null);

  useEffect(() => {
  const clientId = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_CLIENT_ID) || process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
    const existing = document.getElementById('gsi-client');
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'gsi-client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.google && googleButtonRef.current) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleResponse,
          });

          window.google.accounts.id.renderButton(googleButtonRef.current, { theme: 'outline', size: 'large' });
        }
      };
    } else {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({ client_id: clientId, callback: handleGoogleResponse });
        window.google.accounts.id.renderButton(googleButtonRef.current, { theme: 'outline', size: 'large' });
      }
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const idToken = response.credential;
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/users/google`, { idToken });
      const { token, user } = res.data;
      login(user, token);
      if (user && user.role === 'admin') navigate('/admin'); else navigate('/Home');
    } catch (err) {
      console.error('Google sign-in failed', err);
      alert('Google sign-in failed');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/users/login`, form);
      const { token, user } = response.data;

      login(user, token);
      // Redirect admins to admin panel, others to Home
      if (user && user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/Home');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="auth-close" onClick={() => navigate("/")}>✕</button>

        <div className="auth-left">
          <h2>Sign in</h2>
          
          <form id="login-form" onSubmit={handleSubmit} className="auth-form">
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
          </form>
        </div>

        <div className="auth-right">
          <button type="submit" form="login-form" className="auth-button-next">
            Next →
          </button>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <div ref={googleButtonRef} id="google-signin-button" />
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '8px' }}>Or sign in with Google</p>
          </div>
          <p className="auth-footer-text">
            Don't have an account? <Link to="/register">Sign up.</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
