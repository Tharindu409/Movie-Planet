import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "./UserContext";

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState([]);
    const { isLoggedIn } = useUserContext();

    useEffect(() => {
        if (isLoggedIn) {
            fetchWatchlist();
        } else {
            setWatchlist([]);
        }
    }, [isLoggedIn]);

    const fetchWatchlist = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/users/watchlist", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWatchlist(response.data);
        } catch (err) {
            console.error("Failed to fetch watchlist", err);
        }
    };

    const addToWatchlist = async (movie) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:5000/users/watchlist", 
                {
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    release_date: movie.release_date
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setWatchlist(response.data.watchlist);
            return true;
        } catch (err) {
            console.error("Failed to add to watchlist", err);
            return false;
        }
    };

    const removeFromWatchlist = async (movieId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`http://localhost:5000/users/watchlist/${movieId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWatchlist(response.data.watchlist);
            return true;
        } catch (err) {
            console.error("Failed to remove from watchlist", err);
            return false;
        }
    };

    const isInWatchlist = (movieId) => {
        return watchlist.some(movie => movie.id === movieId);
    };

    const value = {
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist
    };

    return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
};
