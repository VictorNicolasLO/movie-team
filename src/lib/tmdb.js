
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const searchMovies = async (query) => {
    if (!query) return [];
    if (!API_KEY) {
        console.error("TMDB API Key is missing");
        return [];
    }

    try {
        const response = await fetch(
            `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            }
        );
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Error searching movies:", error);
        return [];
    }
};

export const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `${IMAGE_BASE_URL}${path}`;
};
