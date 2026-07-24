import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (editingUser) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/users/${editingUser._id}`, form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/users`, form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchUsers();
            closeModal();
        } catch (err) { alert("Operation failed"); }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setForm({
            name: user.name,
            email: user.email,
            password: "", // Handled separately usually, or ignored in update
            role: user.role
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user account?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) { alert("Delete failed"); }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setForm({ name: "", email: "", password: "", role: "user" });
    };

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2>User <span style={{ color: '#e5a00d' }}>Management</span></h2>
                <button className="admin-btn btn-add" onClick={() => setIsModalOpen(true)}>
                    <FaPlus /> New User
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td style={{ fontWeight: 600 }}>{u.name}</td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`role-badge ${u.role === 'admin' ? 'active' : ''}`} 
                                          style={{ background: u.role === 'admin' ? '#e5a00d' : '#222', color: u.role === 'admin' ? 'black' : '#888', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                        {u.role}
                                    </span>
                                </td>
                                <td style={{ color: '#555', fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button className="admin-btn btn-edit" onClick={() => handleEdit(u)}><FaEdit /></button>
                                    <button className="admin-btn btn-delete" onClick={() => handleDelete(u._id)}><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{editingUser ? "Edit" : "Create"} <span style={{ color: '#e5a00d' }}>User</span></h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-form-group">
                                <label>Full Name</label>
                                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                            </div>
                            <div className="admin-form-group">
                                <label>Email Address</label>
                                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                            </div>
                            {!editingUser && (
                                <div className="admin-form-group">
                                    <label>Temporary Password</label>
                                    <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                                </div>
                            )}
                            <div className="admin-form-group">
                                <label>Account Role</label>
                                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="cancel-modal-btn" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="submit-btn">{editingUser ? "Update" : "Save User"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
