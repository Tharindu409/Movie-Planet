import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/MovieDetails.css';

const LocalMovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/local/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!movie) return <div className="error-message">Movie not found</div>;

  return (
    <div className="movie-details-container">
      <div className="details-content">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="main-info">
          <div className="poster-container">
            <img src={movie.posterImage || 'https://via.placeholder.com/500x750?text=No+Image'} alt={movie.title} className="details-poster" />
          </div>
          <div className="text-info">
            <h1>{movie.title}</h1>
            <div className="meta">
              <span className="runtime">{movie.releaseYear}</span>
            </div>
            <h3>Overview</h3>
            <p className="overview">{movie.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalMovieDetails;
