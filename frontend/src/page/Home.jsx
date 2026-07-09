
import MovieCard from "../components/MovieCard";
import { useState ,useEffect} from "react";
import {searchMovies , getPoulerMovies, discoverMovies, getGenres} from '../services/api';
import '../css/Home.css';
import SearchDropdown from '../components/SearchDropdown';
 

  function Home (){
    const [searchQuery , setSearchQuery]= useState(""); 
    const [movies,setMovies] = useState([]);
    const [heroMovies, setHeroMovies] = useState([]);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [error,setError]= useState (null);
        const [loading,setLoading]= useState (true);
        const [showDropdown, setShowDropdown] = useState(false);
        const [genresMap, setGenresMap] = useState({});

    useEffect(()=>{
        const loadPopularMovies = async () => {
            try{
                const popularMovies = await getPoulerMovies();
                setMovies(popularMovies);
                setHeroMovies(popularMovies.slice(0, 5));
            }catch(err){
                console.log(err)
                setError("Failed to lead movies")
            }
            finally{
                setLoading(false)
            }
        }
        loadPopularMovies();
        // load genres map
        const loadGenres = async () => {
            try {
                const g = await getGenres();
                const map = {};
                g.forEach(item => { map[item.name.toLowerCase()] = item.id; });
                setGenresMap(map);
            } catch (err) { console.error('Failed to load genres', err); }
        };
        loadGenres();
    },[])

    // Hero carousel auto-advance
    useEffect(() => {
        if (heroMovies.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [heroMovies]);
    
    const handleSearch=async(e)=>{
        e.preventDefault();
        if(!searchQuery.trim())return
        if(loading)return

        setLoading(true);
        try{
            const searchResults = await searchMovies(searchQuery);
            setMovies(searchResults);
            setError(null)
        }catch(err){
            console.log(err)
            setError("Failed to search movies")
        }finally{
           setLoading(false)
        }
    };

        const handleCategorySelect = async (categoryName) => {
            if (!categoryName) return;
            const id = genresMap[categoryName.toLowerCase()];
            if (!id) {
                // fallback: search by name
                try {
                    const results = await searchMovies(categoryName);
                    setMovies(results);
                } catch (err) { console.error(err); }
                return;
            }

            try {
                const data = await discoverMovies({ genreId: id });
                setMovies(data.results || []);
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Failed to filter by category');
            }
        };

     const handleHeroCTA = () => {
         const el = document.getElementById('search-input');
         if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
     };

    const currentHero = heroMovies[currentHeroIndex];

    return (
        <div className="home">
            <section 
                className="hero"
                style={{
                    backgroundImage: currentHero ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://image.tmdb.org/t/p/original${currentHero.backdrop_path})` : ""
                }}
            >
                <div className="hero-content">
                    {currentHero && (
                        <div className="hero-movie-info fade-in">
                             <span className="trending-tag">🔥 Trending Now</span>
                             <h1>{currentHero.title}</h1>
                             <p>{currentHero.overview.substring(0, 150)}...</p>
                        </div>
                    )}
                    {!currentHero && (
                        <>
                            <h1>Discover Your Next Favorite Movie</h1>
                            <p>Search popular titles, browse recommendations, and save favorites.</p>
                        </>
                    )}
                    <button className="hero-cta" onClick={handleHeroCTA}>Search Movies</button>
                    
                    {heroMovies.length > 0 && (
                        <div className="hero-dots">
                            {heroMovies.map((_, i) => (
                                <span 
                                    key={i} 
                                    className={`dot ${i === currentHeroIndex ? "active" : ""}`}
                                    onClick={() => setCurrentHeroIndex(i)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

                        <div className="hero-search-wrap">
                            <form onSubmit={handleSearch} className="search-form-hero">
                                <input
                                        id="search-input"
                                        type="text"
                                        placeholder="Search for movies"
                                        className="search-input"
                                        value={searchQuery}
                                        onChange={(e)=> setSearchQuery(e.target.value)}
                                        onFocus={() => setShowDropdown(true)}
                                />
                                <button type="submit" className="search-button">Search</button>
                                {showDropdown && <SearchDropdown onClose={() => setShowDropdown(false)} onSelectCategory={handleCategorySelect} />}
                            </form>
                        </div>
        {error && <div className="error-message">{error}</div>}

        {loading ? (
            <div className="loading">
                loading...
            </div>
        ):(
        <div className="movies-grid">
           {movies.map((movie) => (
             <MovieCard movie={movie} key={movie.id}/>
            )
        )}</div>
        )}
   </div>
    )
}
export default Home;