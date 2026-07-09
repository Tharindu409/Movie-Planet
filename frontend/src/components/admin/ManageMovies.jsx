import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const ManageMovies = () => {
    const [movies, setMovies] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [form, setForm] = useState({
        title: "",
        description: "",
        genre: "",
        releaseYear: "",
        posterImage: "",
        trailerLink: ""
    });

    const fetchMovies = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/admin/movies", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMovies(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchMovies(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const movieData = { ...form, genre: form.genre.split(",").map(g => g.trim()) };
            
            if (editingMovie) {
                await axios.put(`http://localhost:5000/admin/movies/${editingMovie._id}`, movieData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post("http://localhost:5000/admin/movies", movieData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchMovies();
            closeModal();
        } catch (err) { alert("Action failed"); }
    };

    const handleEdit = (movie) => {
        setEditingMovie(movie);
        setForm({
            title: movie.title,
            description: movie.description,
            genre: movie.genre.join(", "),
            releaseYear: movie.releaseYear,
            posterImage: movie.posterImage,
            trailerLink: movie.trailerLink
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this movie?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/admin/movies/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMovies();
        } catch (err) { alert("Delete failed"); }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMovie(null);
        setForm({ title: "", description: "", genre: "", releaseYear: "", posterImage: "", trailerLink: "" });
    };

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2>Movie <span style={{ color: '#e5a00d' }}>Management</span></h2>
                <button className="admin-btn btn-add" onClick={() => setIsModalOpen(true)}>
                    <FaPlus /> Add New Movie
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Poster</th>
                            <th>Title</th>
                            <th>Year</th>
                            <th>Genre</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map(m => (
                            <tr key={m._id}>
                                <td><img src={m.posterImage} alt="" style={{ height: '40px', borderRadius: '4px' }} /></td>
                                <td style={{ fontWeight: 600 }}>{m.title}</td>
                                <td>{m.releaseYear}</td>
                                <td>{m.genre.join(", ")}</td>
                                <td>
                                    <button className="admin-btn btn-edit" onClick={() => handleEdit(m)}><FaEdit /></button>
                                    <button className="admin-btn btn-delete" onClick={() => handleDelete(m._id)}><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{editingMovie ? "Edit" : "Add"} <span style={{ color: '#e5a00d' }}>Movie</span></h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-form-group">
                                <label>Title</label>
                                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                            </div>
                            <div className="admin-form-group">
                                <label>Description</label>
                                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="3" required />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="admin-form-group" style={{ flex: 1 }}>
                                    <label>Release Year</label>
                                    <input type="number" value={form.releaseYear} onChange={e => setForm({...form, releaseYear: e.target.value})} required />
                                </div>
                                <div className="admin-form-group" style={{ flex: 1 }}>
                                    <label>Genre (comma separated)</label>
                                    <input value={form.genre} onChange={e => setForm({...form, genre: e.target.value})} required />
                                </div>
                            </div>
                            <div className="admin-form-group">
                                <label>Poster Image URL</label>
                                <input value={form.posterImage} onChange={e => setForm({...form, posterImage: e.target.value})} />
                            </div>
                            <div className="admin-form-group">
                                <label>Trailer YouTube Link</label>
                                <input value={form.trailerLink} onChange={e => setForm({...form, trailerLink: e.target.value})} />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="cancel-modal-btn" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="submit-btn">{editingMovie ? "Update" : "Create"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMovies;
