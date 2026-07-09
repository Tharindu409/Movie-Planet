import { useState } from "react";
import "../css/MovieCard.css"
import { useMovieContext } from "../contexts/MovieContext";
import { useWatchlist } from "../contexts/WatchlistContext";
import { Link } from "react-router-dom";
import { FaBookmark, FaRegBookmark, FaListUl } from "react-icons/fa";
import AddToCollectionModal from "./AddToCollectionModal";

function MovieCard({ movie }) {
  const { isFavorite, addtoFav, removeFav } = useMovieContext();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [showCollModal, setShowCollModal] = useState(false);
  
  const favorite = isFavorite(movie.id);
  const inWatchlist = isInWatchlist(movie.id);

  function OnFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) removeFav(movie.id);
    else addtoFav(movie);
  }

  function onWatchlistClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) removeFromWatchlist(movie.id);
    else addToWatchlist(movie);
  }

  function onCollectionClick(e) {
    e.preventDefault();
    e.stopPropagation();
    setShowCollModal(true);
  }

  return (
    <>
      <div className="movie-card">
        <Link to={`/movie/${movie.id}`} className="movie-link">
          <div className="movie-poster">
            <img 
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'} 
              alt={movie.title} 
            />
            <div className="movie-overlay">
              <button 
                className={`favorite-btn ${favorite ? "active" : ""}`} 
                onClick={OnFavoriteClick}
                title={favorite ? "Remove from favorites" : "Add to favorites"}
              >
                &#x2665;
              </button>
              <button 
                className={`watchlist-btn ${inWatchlist ? "active" : ""}`} 
                onClick={onWatchlistClick}
                title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              >
                {inWatchlist ? <FaBookmark /> : <FaRegBookmark />}
              </button>
              <button 
                className="collection-add-btn" 
                onClick={onCollectionClick}
                title="Add to custom collection"
                style={{ 
                  position: 'absolute', 
                  bottom: '10px', 
                  left: '10px', 
                  background: 'rgba(0,0,0,0.6)', 
                  border: 'none', 
                  color: 'white', 
                  padding: '8px', 
                  borderRadius: '50%', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
              >
                <FaListUl style={{ fontSize: '0.9rem' }} />
              </button>
            </div>
          </div>
          <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>{movie.release_date?.split("-")[0]}</p>
          </div>
        </Link>
      </div>

      {showCollModal && (
        <AddToCollectionModal 
          movie={movie} 
          onClose={() => setShowCollModal(false)}
        />
      )}
    </>
  );
}

export default MovieCard;