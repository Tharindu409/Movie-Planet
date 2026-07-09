import { createContext,useState,useContext,useEffect } from "react";

const MovieContext = createContext();
export const useMovieContext=()=>useContext(MovieContext)

export const MovieProvider=({children})=>{
    const [favorites,setfavorites] = useState([]);

    useEffect(()=>{
        const storedFav = localStorage.getItem("favorites")
        if(storedFav) setfavorites(JSON.parse(storedFav))
    },[])
    
    useEffect(()=>{
        localStorage.setItem('favorites',JSON.stringify(favorites))
    },[favorites])

    const addtoFav = (movie)=>{
        setfavorites(prev => [...prev,movie])
    }
    const removeFav =(movieId)=>{
        setfavorites(prev => prev.filter(movie => movie.id !== movieId))
    }
    const isFavorite = (movieId)=>{
        return favorites.some(movie => movie.id === movieId)
    }
    const value = {
        favorites,
        addtoFav,
        removeFav,
        isFavorite
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}
