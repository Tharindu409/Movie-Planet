import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCollectionContext } from "../contexts/CollectionContext";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import "../css/Collections.css";

const CollectionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { removeMovieFromCollection } = useCollectionContext();
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/collections/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCollection(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleRemoveMovie = async (movieId) => {
        if (!window.confirm("Remove this movie from the collection?")) return;
        await removeMovieFromCollection(id, movieId);
        setCollection(prev => ({
            ...prev,
            movies: prev.movies.filter(m => m.movieId !== movieId)
        }));
    };

    if (loading) return <div className="collections-page"><h2>Loading...</h2></div>;
    if (!collection) return <div className="collections-page"><h2>Collection not found.</h2></div>;

    return (
        <div className="collections-page">
            <div className="collections-header">
                <div>
                    <button onClick={() => navigate('/collections')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                        <FaArrowLeft /> Back to Collections
                    </button>
                    <h1>{collection.name}</h1>
                    <p style={{ color: '#888', marginTop: '0.5rem' }}>{collection.description}</p>
                </div>
            </div>

            {collection.movies.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '4rem', color: '#666' }}>
                    <p>No movies in this collection yet.</p>
                    <Link to="/Home" style={{ color: '#e5a00d', textDecoration: 'none', fontWeight: 'bold' }}>Browse some movies</Link>
                </div>
            ) : (
                <div className="coll-movie-grid">
                    {collection.movies.map(movie => (
                        <div key={movie.movieId} className="coll-movie-card">
                            <button className="remove-coll-movie" onClick={() => handleRemoveMovie(movie.movieId)}>
                                <FaTrash />
                            </button>
                            <Link to={`/movie/${movie.movieId}`}>
                                <img 
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                    alt={movie.title}
                                    style={{ width: '100%', borderRadius: '10px', display: 'block' }}
                                />
                                <div style={{ padding: '10px 0' }}>
                                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'white' }}>{movie.title}</h4>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CollectionDetails;
