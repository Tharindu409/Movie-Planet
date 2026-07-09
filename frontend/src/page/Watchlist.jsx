import React from "react";
import '../css/Favorites.css';
import { useWatchlist } from "../contexts/WatchlistContext";
import MovieCard from "../components/MovieCard";

function Watchlist() {
    const { watchlist } = useWatchlist();
    
    if(watchlist && watchlist.length > 0){
        return (
            <div className="favorites-container">
                <h2>My Watchlist</h2> 
                <div className="favorites-grid">
                    {watchlist.map(movie => (
                        <MovieCard movie={movie} key={movie.id}/>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div className="favorites-empty">
            <h2>Your watchlist is empty</h2>
            <p>Add movies you want to watch later and they will appear here.</p>
        </div>
    );
}

export default Watchlist;
