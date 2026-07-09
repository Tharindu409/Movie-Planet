import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCollectionContext } from "../contexts/CollectionContext";
import { FaPlus, FaTrash } from "react-icons/fa";
import "../css/Collections.css";

const Collections = () => {
    const { collections, createCollection, deleteCollection, loading } = useCollectionContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        await createCollection(name, description);
        setName("");
        setDescription("");
        setIsModalOpen(false);
    };

    const handleDelete = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm("Delete this collection and all movies in it?")) {
            deleteCollection(id);
        }
    };

    return (
        <div className="collections-page">
            <div className="collections-header">
                <h1>My <span style={{ color: '#e5a00d' }}>Collections</span></h1>
                <button className="create-coll-btn" onClick={() => setIsModalOpen(true)}>
                    <FaPlus /> New Collection
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '4rem' }}><h2>Loading...</h2></div>
            ) : collections.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '4rem', color: '#666' }}>
                    <p>You haven't created any collections yet.</p>
                </div>
            ) : (
                <div className="collections-grid">
                    {collections.map(coll => (
                        <Link to={`/collections/${coll._id}`} key={coll._id} className="collection-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 className="coll-name">{coll.name}</h3>
                                <button 
                                    className="delete-coll-btn" 
                                    onClick={(e) => handleDelete(e, coll._id)}
                                    style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                            <p className="coll-desc">{coll.description || "No description"}</p>
                            <div className="coll-meta">
                                <span>{coll.movies.length} Movies</span>
                                <span>Updated: {new Date(coll.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Create <span style={{ color: '#e5a00d' }}>Collection</span></h2>
                        <form onSubmit={handleSubmit} className="coll-form">
                            <input 
                                type="text"
                                placeholder="Collection Name (e.g. Marvel Movies)"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="coll-input"
                                required
                            />
                            <textarea 
                                placeholder="Description (optional)"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="coll-textarea"
                                rows="3"
                            />
                            <div className="form-actions">
                                <button type="button" className="cancel-modal-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="submit-btn">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Collections;
