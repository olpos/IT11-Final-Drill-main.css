var link = window.location.href;
var newLink = new URL(link);
const movieId = newLink.searchParams.get("movieId");

const API_KEY = '1bfdbff05c2698dc917dd28c08d41096';
const imgBaseURL = "https://image.tmdb.org/t/p/w500"; // Corrected image base URL

async function getMovieDetails(movieId) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
}

async function getSimilarMovies(movieId) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData.results;
}

function createMovieCard(movie) {
    return `
        <div class="movie-card">
            <img src="${imgBaseURL}${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Rating: ${movie.vote_average} / 10</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movieId');

    try {
        const movieDetails = await getMovieDetails(movieId);

        // Check if poster_path is valid
        if (movieDetails.poster_path) {
            document.getElementById('moviePoster').src = imgBaseURL + movieDetails.poster_path;
        } else {
            console.warn('No poster path available for this movie.');
            document.getElementById('moviePoster').alt = 'Poster not available';
        }

        document.getElementById('movieTitle').innerText = movieDetails.title;
        document.getElementById('movieRating').innerText = `Rating: ${movieDetails.vote_average} / 10`;
        document.getElementById('movieReleaseDate').innerText = `Release Date: ${movieDetails.release_date}`;
        document.getElementById('movieCategory').innerText = `Genres: ${movieDetails.genres.map(genre => genre.name).join(', ')}`;
        document.getElementById('movieOverview').innerText = movieDetails.overview;

        const similarMovies = await getSimilarMovies(movieId);
        const similarMoviesContainer = document.getElementById('similarMovies');
        similarMoviesContainer.innerHTML = similarMovies.map(movie => createMovieCard(movie)).join('');
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
});
