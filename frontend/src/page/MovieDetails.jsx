import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails } from "../services/api";
import { useUserContext } from "../contexts/UserContext";
import axios from "axios";
import "../css/MovieDetails.css";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useUserContext();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Review state
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  
  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const refreshReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/reviews/${id}`);
      setReviews(res.data.reviews);
      setAvgRating(res.data.averageRating);
    } catch (err) {
      console.error("Failed to refresh reviews");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [movieData, reviewsRes] = await Promise.all([
          getMovieDetails(id),
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/reviews/${id}`)
        ]);
        
        setMovie(movieData);
        setReviews(reviewsRes.data.reviews);
        setAvgRating(reviewsRes.data.averageRating);
      } catch (err) {
        setError("Failed to load details.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please login to post a review");
      navigate("/login");
      return;
    }

    setSubmittingReview(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/reviews`,
        { movieId: id, rating: userRating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await refreshReviews();
      setComment("");
      alert("Review posted!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshReviews();
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  const handleEditInit = (rev) => {
    setEditingId(rev._id);
    setEditRating(rev.rating);
    setEditComment(rev.comment);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/reviews/${editingId}`, 
        { rating: editRating, comment: editComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshReviews();
      setEditingId(null);
    } catch (err) {
      alert("Failed to update review");
    }
  };

  if (loading) return <div className="loading">Loading movie details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!movie) return null;

  const trailer = movie.videos?.results.find((v) => v.type === "Trailer");

  return (
    <div className="movie-details-container">
      <div 
        className="details-backdrop"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      <div className="details-content">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="main-info">
          <div className="poster-container">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title} 
              className="details-poster"
            />
          </div>

          <div className="text-info">
            <h1>{movie.title}</h1>
            <p className="tagline">{movie.tagline}</p>
            
            <div className="meta">
              <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
              {avgRating > 0 && (
                <span className="user-avg-rating" style={{ color: '#ffcc00' }}>
                  👥 User Rating: {avgRating}/5
                </span>
              )}
              <span className="runtime">{movie.runtime} min</span>
              <span className="release-date">{movie.release_date?.split("-")[0]}</span>
            </div>

            <div className="genres">
              {movie.genres?.map((g) => (
                <span key={g.id} className="genre-tag">{g.name}</span>
              ))}
            </div>

            <h3>Overview</h3>
            <p className="overview">{movie.overview}</p>

            {trailer && (
              <a 
                href={`https://www.youtube.com/watch?v=${trailer.key}`} 
                target="_blank" 
                rel="noreferrer"
                className="trailer-btn"
              >
                ▶ Watch Trailer
              </a>
            )}
          </div>
        </div>

        <div className="cast-section">
          <h3>Top Cast</h3>
          <div className="cast-grid">
            {movie.credits?.cast.slice(0, 6).map((person) => (
              <div key={person.id} className="cast-card">
                <img 
                  src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : "https://via.placeholder.com/185x278?text=No+Image"} 
                  alt={person.name} 
                />
                <p className="cast-name">{person.name}</p>
                <p className="cast-character">{person.character}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Review Section */}
        <div className="review-section">
          <div className="review-form-container">
            <h3>Post a Review</h3>
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="rating-input">
                <label>Rating: </label>
                <select 
                  value={userRating} 
                  onChange={(e) => setUserRating(Number(e.target.value))}
                  className="rating-select"
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                  <option value="4">⭐⭐⭐⭐ (4)</option>
                  <option value="3">⭐⭐⭐ (3)</option>
                  <option value="2">⭐⭐ (2)</option>
                  <option value="1">⭐ (1)</option>
                </select>
              </div>
              <textarea 
                placeholder="Write your review here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <button type="submit" disabled={submittingReview} className="submit-review-btn">
                {submittingReview ? "Posting..." : "Submit Review"}
              </button>
            </form>
          </div>

          <div className="reviews-list">
            <h3>Recent Reviews ({reviews.length})</h3>
            {reviews.length === 0 ? (
              <p>No reviews yet. Be the first!</p>
            ) : (
              <div className="reviews-grid">
                {reviews.map((rev) => (
                  <div key={rev._id} className="review-card">
                    {editingId === rev._id ? (
                      <form onSubmit={handleUpdate} className="edit-review-form">
                         <div className="rating-input">
                          <select 
                            value={editRating} 
                            onChange={(e) => setEditRating(Number(e.target.value))}
                            className="rating-select"
                          >
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                          </select>
                        </div>
                        <textarea 
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="edit-textarea"
                          required
                        />
                        <div className="edit-actions">
                          <button type="submit" className="save-btn">Save</button>
                          <button type="button" className="cancel-btn" onClick={handleEditCancel}>Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="review-header">
                          <span className="reviewer-name">{rev.userName}</span>
                          <span className="reviewer-stars">{"⭐".repeat(rev.rating)}</span>
                        </div>
                        <p className="review-text">{rev.comment}</p>
                        <div className="review-footer">
                          <span className="review-date">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                          {user && user.id === rev.user && (
                            <div className="owner-actions">
                              <button onClick={() => handleEditInit(rev)} className="edit-link">Edit</button>
                              <button onClick={() => handleDelete(rev._id)} className="delete-link">Delete</button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
