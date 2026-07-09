const API_KEY = "e6dec2a2e9057b67dfaedacce26dcc7d";
const BASE_URL = "https://api.themoviedb.org/3";

export const getPoulerMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const searchMovies = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.results;
};

export const getMovieDetails = async (id) => {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`
  );
  const data = await response.json();
  return data;
};

// Trending movies (day/week)
export const getTrendingMovies = async (timeWindow = "week") => {
  const response = await fetch(
    `${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

// Discover with filters (genre, year, rating)
export const discoverMovies = async ({ genreId, year, sortBy, page = 1 }) => {
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy || "popularity.desc"}`;
  if (genreId) url += `&with_genres=${genreId}`;
  if (year) url += `&primary_release_year=${year}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// Get genre list
export const getGenres = async () => {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  const data = await response.json();
  return data.genres;
};

// Recommendations based on a specific movie
export const getMovieRecommendations = async (movieId) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

// Movies by genre (for watchlist-based recommendations)
export const getMoviesByGenre = async (genreId) => {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=100`
  );
  const data = await response.json();
  return data.results;
};