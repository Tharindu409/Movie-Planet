import React from "react";
import '../css/Favorites.css';
import {useMovieContext} from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";


function Faviourite(){
    const {favorites} = useMovieContext();
    
    if(favorites.length >0){
        return <div className="favorites-container">
            <h2>Your Favorites</h2> 
            <div className="favorites-grid">
                {favorites.map(movie => (
                    <MovieCard movie={movie} key={movie.id}/>
                ))}
            </div>
        </div>
    }
    
    return <div className="favorites-empty">
        <h2>No favorites added yet</h2>
        <p>Start adding movies to your favorites and they will appear here.</p>
    </div>
}
export default Faviourite;