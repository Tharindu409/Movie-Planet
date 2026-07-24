import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const ManageCast = () => {
    const [cast, setCast] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCast, setEditingCast] = useState(null);
    const [form, setForm] = useState({
        name: "",
        biography: "",
        profileImage: "",
        birthDate: "",
        moviesAppearedIn: ""
    });

    const fetchCast = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/cast`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCast(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchCast(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const castData = { ...form, moviesAppearedIn: form.moviesAppearedIn.split(",").map(m => m.trim()) };
            
            if (editingCast) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/cast/${editingCast._id}`, castData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/cast`, castData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchCast();
            closeModal();
        } catch (err) { alert("Operation failed"); }
    };

    const handleEdit = (c) => {
        setEditingCast(c);
        setForm({
            name: c.name,
            biography: c.biography,
            profileImage: c.profileImage,
            birthDate: c.birthDate ? c.birthDate.split("T")[0] : "",
            moviesAppearedIn: c.moviesAppearedIn.join(", ")
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this profile?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/cast/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCast();
        } catch (err) { alert("Delete failed"); }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCast(null);
        setForm({ name: "", biography: "", profileImage: "", birthDate: "", moviesAppearedIn: "" });
    };

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2>Cast & <span style={{ color: '#e5a00d' }}>Celebrity</span></h2>
                <button className="admin-btn btn-add" onClick={() => setIsModalOpen(true)}>
                    <FaPlus /> Add Celebrity
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Birth Date</th>
                            <th>Movies</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cast.map(c => (
                            <tr key={c._id}>
                                <td><img src={c.profileImage} alt="" style={{ height: '40px', width: '40px', objectFit: 'cover', borderRadius: '50%' }} /></td>
                                <td style={{ fontWeight: 600 }}>{c.name}</td>
                                <td>{c.birthDate ? new Date(c.birthDate).toLocaleDateString() : "N/A"}</td>
                                <td style={{ fontSize: '0.8rem', maxWidth: '200px' }}>{c.moviesAppearedIn.join(", ")}</td>
                                <td>
                                    <button className="admin-btn btn-edit" onClick={() => handleEdit(c)}><FaEdit /></button>
                                    <button className="admin-btn btn-delete" onClick={() => handleDelete(c._id)}><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{editingCast ? "Edit" : "Add"} <span style={{ color: '#e5a00d' }}>Celebrity</span></h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-form-group">
                                <label>Full Name</label>
                                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                            </div>
                            <div className="admin-form-group">
                                <label>Biography</label>
                                <textarea value={form.biography} onChange={e => setForm({...form, biography: e.target.value})} rows="3" required />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="admin-form-group" style={{ flex: 1 }}>
                                    <label>Birth Date</label>
                                    <input type="date" value={form.birthDate} onChange={e => setForm({...form, birthDate: e.target.value})} />
                                </div>
                                <div className="admin-form-group" style={{ flex: 1 }}>
                                    <label>Movies (comma separated)</label>
                                    <input value={form.moviesAppearedIn} onChange={e => setForm({...form, moviesAppearedIn: e.target.value})} />
                                </div>
                            </div>
                            <div className="admin-form-group">
                                <label>Profile Image URL</label>
                                <input value={form.profileImage} onChange={e => setForm({...form, profileImage: e.target.value})} />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="cancel-modal-btn" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="submit-btn">{editingCast ? "Update" : "Save Profile"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCast;
