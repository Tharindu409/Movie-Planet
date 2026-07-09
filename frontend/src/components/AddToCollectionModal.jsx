import React from "react";
import { useCollectionContext } from "../contexts/CollectionContext";
import { FaPlus } from "react-icons/fa";
import "../css/Collections.css";

const AddToCollectionModal = ({ movie, onClose }) => {
    const { collections, addMovieToCollection } = useCollectionContext();

    const handleAdd = async (collId) => {
        const success = await addMovieToCollection(collId, movie);
        if (success) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 style={{ marginBottom: '1.5rem' }}>Add to <span style={{ color: '#e5a00d' }}>Collection</span></h2>
                <p style={{ color: '#888', marginBottom: '2rem' }}>Choose a collection to add <strong>{movie.title}</strong> to:</p>
                
                {collections.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>No collections found.</p>
                        <p style={{ fontSize: '0.9rem', color: '#555' }}>Create one first from the Collections page.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                        {collections.map(coll => (
                            <button 
                                key={coll._id} 
                                onClick={() => handleAdd(coll._id)}
                                style={{
                                    background: '#1a1a1a',
                                    border: '1px solid #333',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    color: 'white',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e5a00d'; e.currentTarget.style.transform = 'translateX(5px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.transform = 'translateX(0)'; }}
                            >
                                <span style={{ fontWeight: '600' }}>{coll.name}</span>
                                <FaPlus style={{ color: '#e5a00d', fontSize: '0.8rem' }} />
                            </button>
                        ))}
                    </div>
                )}

                <button 
                    onClick={onClose} 
                    className="cancel-modal-btn" 
                    style={{ width: '100%', marginTop: '1.5rem' }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default AddToCollectionModal;
