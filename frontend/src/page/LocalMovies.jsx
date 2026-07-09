import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/Home.css';

const LocalMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('http://localhost:5000/local/movies');
        setMovies(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="loading">Loading local movies...</div>;

  return (
    <div className="home">
      <h2 style={{ margin: '1rem 0' }}>Local Movies</h2>
      <div className="movies-grid">
        {movies.map((m) => (
          <div key={m._id} className="movie-card">
            <Link to={`/local/${m._id}`} className="movie-link">
              <div className="movie-poster">
                <img src={m.posterImage || 'https://via.placeholder.com/500x750?text=No+Image'} alt={m.title} />
              </div>
              <div className="movie-info">
                <h3>{m.title}</h3>
                <p>{m.releaseYear}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocalMovies;
