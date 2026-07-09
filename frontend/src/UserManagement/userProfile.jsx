import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaEdit, FaSignOutAlt, FaCog, FaBookmark, FaQuestionCircle } from "react-icons/fa";
import "../css/Profile.css";

const UserProfile = () => {
    const { logout, login } = useUserContext();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formState, setFormState] = useState({ name: '', email: '', password: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const res = await axios.get("http://localhost:5000/users/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserData(res.data);
                setFormState({ name: res.data.name || '', email: res.data.email || '', password: '' });
            } catch (err) {
                console.error(err);
                setError("Failed to load profile details.");
                if (err.response?.status === 401) {
                    logout();
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate, logout]);

    const handleLogoutClick = () => {
        logout();
        navigate("/login");
    };

    const handleEditToggle = () => {
        setEditing((v) => !v);
    };

    const handleFormChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const payload = { name: formState.name, email: formState.email };
            if (formState.password) payload.password = formState.password;
            const res = await axios.put('http://localhost:5000/users/profile', payload, { headers: { Authorization: `Bearer ${token}` } });
            const updatedUser = res.data.user;
            // update context and localStorage
            login(updatedUser, token);
            setUserData(updatedUser);
            setEditing(false);
            alert('Profile updated');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to update profile');
        }
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-card" style={{ textAlign: 'center', borderColor: '#e5a00d' }}>
                    <h2 style={{ color: 'white' }}>Loading Profile...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <div className="profile-card" style={{ textAlign: 'center' }}>
                    <h2 style={{ color: '#ff4d4d' }}>{error}</h2>
                    <button className="edit-btn" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => navigate('/login')}>
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="compact-card">
                    <div className="compact-top">
                        <div className="compact-avatar">
                            <img src={`https://ui-avatars.com/api/?name=${userData?.name || 'User'}&background=random&size=200`} alt="profile" />
                        </div>
                    </div>

                    <div className="compact-name">
                        <div className="display-name">{userData?.name}</div>
                        <div className="display-username">{userData?.email?.split('@')[0]}</div>
                    </div>

                    {!editing ? (
                        <>
                            <div className="section-title">MY ACCOUNT</div>
                            <div className="account-list">
                                <button className="account-item" onClick={() => setEditing(true)}>
                                    <FaCog className="item-icon" /> Account Settings
                                </button>
                                <button className="account-item" onClick={() => navigate('/watchlist')}>
                                    <FaBookmark className="item-icon" /> My Watchlist
                                </button>
                                <button className="account-item" onClick={() => alert('Open support') }>
                                    <FaQuestionCircle className="item-icon" /> Support
                                </button>
                            </div>

                            <div className="divider" />

                            <button className="signout-item" onClick={handleLogoutClick}>
                                <FaSignOutAlt className="item-icon" /> Sign Out
                            </button>
                        </>
                    ) : (
                        <div className="edit-form">
                            <input name="name" value={formState.name} onChange={handleFormChange} placeholder="Full name" />
                            <input name="email" value={formState.email} onChange={handleFormChange} placeholder="Email" />
                            <input name="password" value={formState.password} onChange={handleFormChange} placeholder="New password (optional)" type="password" />
                            <div className="edit-actions">
                                <button onClick={handleSave} className="action-btn edit-btn">Save</button>
                                <button onClick={() => setEditing(false)} className="action-btn">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;