import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from './UserContext';

const CollectionContext = createContext();

export const useCollectionContext = () => useContext(CollectionContext);

export const CollectionProvider = ({ children }) => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isLoggedIn } = useUserContext();

    const fetchCollections = async () => {
        if (!isLoggedIn) {
            setCollections([]);
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/collections`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCollections(res.data);
        } catch (err) {
            console.error("Failed to fetch collections", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, [isLoggedIn]);

    const createCollection = async (name, description) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/collections`, 
                { name, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCollections(prev => [res.data, ...prev]);
            return res.data;
        } catch (err) {
            alert("Failed to create collection");
        }
    };

    const deleteCollection = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/collections/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCollections(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            alert("Failed to delete collection");
        }
    };

    const addMovieToCollection = async (collectionId, movie) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/collections/${collectionId}/movies`,
                {
                    movieId: movie.id.toString(),
                    title: movie.title,
                    poster_path: movie.poster_path
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCollections(prev => prev.map(c => c._id === collectionId ? res.data : c));
            return true;
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add movie");
            return false;
        }
    };

    const removeMovieFromCollection = async (collectionId, movieId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/collections/${collectionId}/movies/${movieId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCollections(prev => prev.map(c => c._id === collectionId ? res.data : c));
        } catch (err) {
            alert("Failed to remove movie");
        }
    };

    return (
        <CollectionContext.Provider value={{ 
            collections, 
            loading, 
            createCollection, 
            deleteCollection, 
            addMovieToCollection, 
            removeMovieFromCollection,
            refreshCollections: fetchCollections 
        }}>
            {children}
        </CollectionContext.Provider>
    );
};
