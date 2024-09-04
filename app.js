const API_KEY = '1bfdbff05c2698dc917dd28c08d41096';
const IMAGE_PATH = 'https://image.tmdb.org/t/p/w1280';

const input = document.querySelector('.search input');
const btn = document.querySelector('.search button');
const mainGridTitle = document.querySelector('.favorites h1');
const mainGrid = document.querySelector('.favorites .movies-grid');
const trendingElement = document.querySelector('.trending .movies-grid');
const upcomingMoviesGrid = document.querySelector('.movies-container.upcoming .movies-grid');

btn.addEventListener('click', addSearchedMoviesToDom);

async function getMovieBySearch(searchTerm) {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`);
    const responseData = await response.json();
    return responseData.results;
}

function addClickEffectToCard(cards) {
    cards.forEach(card => {
        card.addEventListener('click', () => showPopup(card));
    });
}

async function addSearchedMoviesToDom() {
    const searchTerm = input.value;
    if (!searchTerm) {
        mainGridTitle.innerHTML = '<p class="no-results-message">Please enter a search term.</p>';
        return;
    }

    const data = await getMovieBySearch(searchTerm);

    trendingElement.style.display = 'none';
    upcomingMoviesGrid.style.display = 'none';

    document.querySelector('.trending h1').style.display = 'none';
    document.querySelector('.movies-container.upcoming h1').style.display = 'none';

    if (data.length === 0) {
        mainGridTitle.innerHTML = '<p class="no-results-message">No movies found for the given search term</p>';
        mainGrid.innerHTML = '';
    } else {
        mainGridTitle.innerText = 'Search Results';
        mainGrid.innerHTML = data.map(movie => createMovieCard(movie)).join('');

        const cards = document.querySelectorAll('.card');
        addClickEffectToCard(cards);
    }
}

function createMovieCard(movie) {
    const posterSrc = movie.poster_path ? `${IMAGE_PATH + movie.poster_path}` : 'path/to/default-image.jpg';
    return `
        <div class="card" data-id="${movie.id}">
            <div class="img">
                <img src="${posterSrc}" alt="${movie.title}">
            </div>
            <div class="info">
                <h3>${movie.title}</h3>
                <div class="single-info">
                    <span>Rate: </span>
                    <span>${movie.vote_average} / 10</span>
                </div>
                <div class="single-info">
                    <span>Release Date: </span>
                    <span>${movie.release_date}</span>
                </div>
            </div>
        </div>
    `;
}

async function fetchUpcomingMoviesForJanuary() {
    try {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const apiUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1&primary_release_date.gte=${firstDayOfMonth.toISOString().split('T')[0]}&primary_release_date.lte=${lastDayOfMonth.toISOString().split('T')[0]}`;
        
        const response = await fetch(apiUrl);
        const responseData = await response.json();
        return responseData.results;
    } catch (error) {
        console.error('Error in fetchUpcomingMoviesForJanuary:', error);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const upcomingMoviesData = await fetchUpcomingMoviesForJanuary();
    upcomingMoviesGrid.innerHTML = upcomingMoviesData.map(movie => createMovieCard(movie)).join('');
});

async function addToDomTrending() {
    const data = await getTrendingMovies();
    trendingElement.innerHTML = data.slice(0, 6).map(movie => createMovieCard(movie)).join('');
}

async function getTrendingMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`);
    const responseData = await response.json();
    return responseData.results;
}

async function addToDomAllMovies() {
    const data = await getAllMovies();
    mainGrid.innerHTML = data.map(movie => createMovieCard(movie)).join('');
    const cards = document.querySelectorAll('.card');
    addClickEffectToCard(cards);
}

async function getAllMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
    const responseData = await response.json();
    return responseData.results;
}

async function displayMovies() {
    await addToDomTrending();
    await addToDomAllMovies();
}

displayMovies();

document.addEventListener('DOMContentLoaded', () => {
    const movieContainers = document.querySelectorAll('.movies-container .movies-grid');
    movieContainers.forEach(container => {
        container.addEventListener('click', (event) => redirectToMovieDetails(event));
    });
});

function redirectToMovieDetails(event) {
    const clickedMovie = event.target.closest('.card');

    if (clickedMovie) {
        const movieId = clickedMovie.getAttribute('data-id');
        window.location.href = `movie_details.html?movieId=${movieId}`; // Corrected parameter to movieId
    }
}
