# React Movie App - AI Coding Instructions

## Architecture Overview

**React 19 + Vite movie discovery app** with TMDB API integration and client-side routing:

- **Data Flow**: TMDB API (`api.js`) → React state → Context (`MovieContext.jsx`) → Components
- **Pages**: `Home.jsx` (search/grid), `Favourites.jsx` (favorites list)
- **State**: Global favorites via Context API with localStorage persistence
- **Routing**: React Router v7 in [App.jsx](../frontend/src/App.jsx); BrowserRouter in [main.jsx](../frontend/src/main.jsx)

## State Management: MovieContext Pattern

Favorites stored globally in [MovieContext.jsx](../frontend/src/contexts/MovieContext.jsx) with:
- **useMovieContext()** hook - access anywhere with `const {favorites, addtoFav, removeFav, isFavorite} = useMovieContext()`
- **Persistence**: synced to localStorage automatically on mount and update
- **Structure**: `favorites` is array of full movie objects; use `isFavorite(movieId)` to check state

This context is correctly wired: [App.jsx](../frontend/src/App.jsx) wraps routes with `<MovieProvider>`, so all components access it.

## API Integration

[api.js](../frontend/src/services/api.js) wraps TMDB endpoints (hardcoded API key for now):
- `getPoulerMovies()` - returns popular movies array
- `searchMovies(query)` - searches by title (handles URL encoding)
- Both return `data.results` from TMDB response

**Movie Object Schema**: `{id, title, poster_path, release_date}`; MovieCard constructs image URL as `https://image.tmdb.org/t/p/w500${movie.poster_path}`

## Known Issues to Fix

1. **Favorites hook name**: [Favourites.jsx](../frontend/src/page/Favourites.jsx) calls `userMovieContext()` (typo) - should be `useMovieContext()`
2. **Spelling**: File named "Faviourite" not "Favourite"; also imports as "Faviourites" in [App.jsx](../frontend/src/App.jsx)
3. **CSS**: Navbar.css referenced but file is Navbar.css (case-sensitive on Linux)
4. **MovieCard**: Verify `movie.poster_path` exists before rendering (defensive check)

## Development Commands

```bash
cd frontend
npm run dev     # Vite dev server with HMR on localhost:5173
npm run build   # Production minified build to dist/
npm run preview # Local preview of prod build
npm run lint    # ESLint check
```

## Component Patterns

**Functional components with hooks only**. No PropTypes or TypeScript. Components:
- `MovieCard({movie})` - renders poster + title + favorite button; destructures prop
- `Home()` - handles search form, API calls, loading/error states
- `Favourites()` - reads `favorites` array from context (empty state: "No favorites added yet")
- `NavBar()` - navigation links using `<Link>` from react-router-dom

**Event handlers**: prefix with `handle` or `On` (e.g., `handleSearch`, `OnFavoriteClick`)

## Styling

Plain CSS only (no CSS-in-JS, no modules). Files:
- [App.css](../frontend/src/css/App.css) - root layout
- [Home.css](../frontend/src/css/Home.css) - search form, grid
- [MovieCard.css](../frontend/src/css/MovieCard.css) - card display, overlay
- [Favorites.css](../frontend/src/css/Favorites.css) - favorites page
- [Navbar.css](../frontend/src/css/Navbar.css) - navigation

Classes follow pattern: `.movie-card`, `.movie-poster`, `.movie-overlay`, `.search-form`

## Routing

Routes in [App.jsx](../frontend/src/App.jsx):
- `/` → `<Home/>` (search + popular movies)
- `/favourite` → `<Favourites/>` (favorites list)

Use `<Link to="/">` from react-router-dom for navigation (never use `<a>` tags).
