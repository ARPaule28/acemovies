import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

const API_KEY = '61dbf93bc477bfa271e96175dd1a380d';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function HomePage({ 
  handleMovieClick, 
  setShowSearchModal, 
  featuredMovie, 
  trendingMovies, 
  popularMovies, 
  upcomingMovies,
  currentTrendingPage,
  currentPopularPage,
  currentUpcomingPage,
  loadMoreTrending,
  loadMorePopular,
  loadMoreUpcoming 
}) {
  return (
    <div className="main-content">
      {/* Featured Movie Section */}
      {featuredMovie && (
        <div className="featured-movie">
          <img 
            className="featured-poster" 
            src={`${IMG_URL}${featuredMovie.poster_path}`} 
            alt={featuredMovie.title}
            onClick={() => handleMovieClick(featuredMovie)}
          />
          <div className="featured-details">
            <h1 className="featured-title">{featuredMovie.title}</h1>
            <div className="featured-rating">
              Rating: {featuredMovie.vote_average.toFixed(1)}/10
            </div>
            <p className="featured-description">{featuredMovie.overview}</p>
            <button 
              className="watch-button"
              onClick={() => handleMovieClick(featuredMovie)}
            >
              Watch Now
            </button>
            <div className="tags">
              <span className="tag">HD</span>
              <span className="tag">2025</span>
            </div>
          </div>
        </div>
      )}

      {/* Trending Movies Section */}
      <div className="section-header">
        <h2 className="section-title">Trending Movies</h2>
        <div className="pagination">
          {Array.from({ length: 5 }, (_, i) => (
            <button 
              key={i} 
              className={`page-btn ${currentTrendingPage === i + 1 ? 'active' : ''}`}
              onClick={() => loadMoreTrending(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="movie-grid">
        {trendingMovies.map(movie => (
          <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie)}>
            <img 
              className="movie-poster" 
              src={`${IMG_URL}${movie.poster_path}`} 
              alt={movie.title}
            />
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <div className="movie-rating">
                {movie.vote_average.toFixed(1)} ★
              </div>
              <div className="movie-meta">
                <span>HD</span>
                <span>2025</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popular Movies Section */}
      <div className="section-header">
        <h2 className="section-title">Popular Movies</h2>
        <div className="pagination">
          {Array.from({ length: 5 }, (_, i) => (
            <button 
              key={i} 
              className={`page-btn ${currentPopularPage === i + 1 ? 'active' : ''}`}
              onClick={() => loadMorePopular(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="movie-grid">
        {popularMovies.map(movie => (
          <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie)}>
            <img 
              className="movie-poster" 
              src={`${IMG_URL}${movie.poster_path}`} 
              alt={movie.title}
            />
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <div className="movie-rating">
                {movie.vote_average.toFixed(1)} ★
              </div>
              <div className="movie-meta">
                <span>HD</span>
                <span>2025</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Movies Section */}
      <div className="section-header">
        <h2 className="section-title">Upcoming Movies</h2>
        <div className="pagination">
          {Array.from({ length: 5 }, (_, i) => (
            <button 
              key={i} 
              className={`page-btn ${currentUpcomingPage === i + 1 ? 'active' : ''}`}
              onClick={() => loadMoreUpcoming(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="movie-grid">
        {upcomingMovies.map(movie => (
          <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie)}>
            <img 
              className="movie-poster" 
              src={`${IMG_URL}${movie.poster_path}`} 
              alt={movie.title}
            />
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <div className="movie-rating">
                {movie.vote_average.toFixed(1)} ★
              </div>
              <div className="movie-meta">
                <span>HD</span>
                <span>2025</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlayerPage({ currentItem, setCurrentItem, currentServer, setCurrentServer, isLoading, setIsLoading }) {
  const navigate = useNavigate();
  const videoRef = React.useRef(null);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);

  useEffect(() => {
    if (!currentItem) {
      navigate('/');
      return;
    }

    const type = currentItem.media_type === "movie" ? "movie" : "tv";
    let embedURL = "";

    // Updated embed URLs
    switch(currentServer) {
      case 'vidsrc.cc':
        embedURL = `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;
        if (type === 'tv') {
          embedURL += `/${currentSeason}/${currentEpisode}`;
        }
        break;
      case 'vidsrc.me':
        embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;
        if (type === 'tv') {
          embedURL += `&season=${currentSeason}&episode=${currentEpisode}`;
        }
        break;
      default:
        embedURL = `https://player.videasy.net/${type}/${currentItem.id}`;
        if (type === 'tv') {
          embedURL += `/${currentSeason}/${currentEpisode}`;
        }
    }

    if (videoRef.current) {
      videoRef.current.src = embedURL;
      setIsLoading(true);
    }
  }, [currentItem, currentServer, currentSeason, currentEpisode, navigate, setIsLoading]);

  return (
    <div className="player-page">
      <button className="back-button" onClick={() => {
        setCurrentItem(null);
        navigate('/');
      }}>
        &larr; Back to Browse
      </button>
      
      <div className="player-container">
        <div className="player-details">
          <img 
            src={`${IMG_URL}${currentItem.poster_path}`} 
            alt={currentItem.title} 
          />
          <div className="player-text">
            <h2>{currentItem.title}</h2>
            <p className="media-type">
              {currentItem.media_type === 'tv' ? 'TV Series' : 'Movie'}
            </p>
            <div className="stars">
              Rating: {currentItem.vote_average.toFixed(1)}/10
            </div>
            <p>{currentItem.overview}</p>
          </div>
        </div>
        
        <div className="server-selector">
          <label htmlFor="server">Server:</label>
          <select 
            id="server" 
            value={currentServer}
            onChange={(e) => setCurrentServer(e.target.value)}
          >
            <option value="vidsrc.cc">VidSrc</option>
            <option value="vidsrc.me">VidSrc Pro</option>
            <option value="2embed.cc">2Embed</option>
          </select>
        </div>
        
        <div className="video-container">
          <iframe 
            ref={videoRef}
            width="100%" 
            height="500"
            frameBorder="0" 
            allowFullScreen
            title="Video Player"
            sandbox="allow-same-origin allow-scripts allow-forms"
            onError={() => setIsLoading(false)}
            onLoad={() => setIsLoading(false)}
          />
          
          {isLoading && (
            <div className="loading">
              Loading video...
            </div>
          )}
        </div>
      </div>

      {currentItem.media_type === 'tv' && (
        <div className="episodes-container">
          <h3>Episodes</h3>
          <div className="season-selector">
            <select 
              value={currentSeason}
              onChange={(e) => setCurrentSeason(Number(e.target.value))}
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>Season {num}</option>
              ))}
            </select>
          </div>
          <div className="episodes-grid">
            {Array.from({ length: 24 }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                className={`episode-btn ${currentEpisode === num ? 'active' : ''}`}
                onClick={() => setCurrentEpisode(num)}
              >
                Episode {num}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentServer, setCurrentServer] = useState('vidsrc.cc');
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currentTrendingPage, setCurrentTrendingPage] = useState(1);
  const [currentPopularPage, setCurrentPopularPage] = useState(1);
  const [currentUpcomingPage, setCurrentUpcomingPage] = useState(1);

  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    init();
  }, []);

  async function fetchTrendingMovies(page = 1) {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    return data.results;
  }

  async function fetchPopularMovies(page = 1) {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    return data.results;
  }

  async function fetchUpcomingMovies(page = 1) {
    const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    return data.results;
  }

  async function loadMoreTrending(page) {
    setCurrentTrendingPage(page);
    const movies = await fetchTrendingMovies(page);
    setTrendingMovies(movies);
    window.scrollTo({
      top: document.querySelector('.section-title').offsetTop - 20,
      behavior: 'smooth'
    });
  }

  async function loadMorePopular(page) {
    setCurrentPopularPage(page);
    const movies = await fetchPopularMovies(page);
    setPopularMovies(movies);
    window.scrollTo({
      top: document.querySelectorAll('.section-title')[1].offsetTop - 20,
      behavior: 'smooth'
    });
  }

  async function loadMoreUpcoming(page) {
    setCurrentUpcomingPage(page);
    const movies = await fetchUpcomingMovies(page);
    setUpcomingMovies(movies);
    window.scrollTo({
      top: document.querySelectorAll('.section-title')[2].offsetTop - 20,
      behavior: 'smooth'
    });
  }

  function handleMovieClick(item) {
    setCurrentItem(item);
    setIsLoading(true);
    navigate('/watch');
  }

  const searchTMDB = debounce(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      // Fetch both movies and TV shows in parallel
      const [movieRes, tvRes] = await Promise.all([
        fetch(
          `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
        ),
        fetch(
          `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
        )
      ]);

      if (!movieRes.ok || !tvRes.ok) {
        throw new Error('Search failed');
      }

      const [movieData, tvData] = await Promise.all([
        movieRes.json(),
        tvRes.json()
      ]);

      // Process movie results
      const movieResults = movieData.results.map(item => ({
        ...item,
        media_type: 'movie',
        title: item.title,
        release_date: item.release_date
      }));

      // Process TV show results
      const tvResults = tvData.results.map(item => ({
        ...item,
        media_type: 'tv',
        title: item.name, // TV shows use 'name' instead of 'title'
        release_date: item.first_air_date // TV shows use 'first_air_date'
      }));

      // Combine and filter results
      const combinedResults = [...movieResults, ...tvResults]
        .filter(item => item.poster_path && item.title)
        .sort((a, b) => b.popularity - a.popularity);

      setSearchResults(combinedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Failed to search media');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, 500);

  async function init() {
    const [trending, popular, upcoming] = await Promise.all([
      fetchTrendingMovies(),
      fetchPopularMovies(),
      fetchUpcomingMovies()
    ]);

    setTrendingMovies(trending);
    setPopularMovies(popular);
    setUpcomingMovies(upcoming);
    setFeaturedMovie(trending[0]);
  }

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <img src="logo.jpg" alt="PLOGO HERE" /><h1>Ace Movies</h1>
        <input 
          type="text" 
          className="search-bar" 
          placeholder="Search..." 
          onFocus={() => setShowSearchModal(true)} 
        />
      </nav>

      <Routes>
        <Route path="/" element={
          <HomePage 
            handleMovieClick={handleMovieClick}
            setShowSearchModal={setShowSearchModal}
            featuredMovie={featuredMovie}
            trendingMovies={trendingMovies}
            popularMovies={popularMovies}
            upcomingMovies={upcomingMovies}
            currentTrendingPage={currentTrendingPage}
            currentPopularPage={currentPopularPage}
            currentUpcomingPage={currentUpcomingPage}
            loadMoreTrending={loadMoreTrending}
            loadMorePopular={loadMorePopular}
            loadMoreUpcoming={loadMoreUpcoming}
          />
        } />
        <Route path="/watch" element={
          currentItem ? (
            <PlayerPage 
              currentItem={currentItem}
              setCurrentItem={setCurrentItem}
              currentServer={currentServer}
              setCurrentServer={setCurrentServer}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          ) : (
            <div>No movie selected. Redirecting...</div>
          )
        } />
      </Routes>

      {/* Updated Search Modal */}
      {showSearchModal && (
        <div className="search-modal">
          <span className="close" onClick={() => {
            setShowSearchModal(false);
            setSearchQuery('');
            setSearchResults([]);
            setSearchError(null);
          }}>&times;</span>
          
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search for movies, TV shows, and anime..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchTMDB(e.target.value);
              }}
              autoFocus
            />
            
            {isSearching && <div className="search-loading">Searching...</div>}
            {searchError && <div className="search-error">{searchError}</div>}
            
            <div className="results">
              {searchResults.length === 0 && searchQuery && !isSearching ? (
                <div className="no-results">No results found</div>
              ) : (
                searchResults.map(item => (
                  <div key={item.id} className="search-result" 
                    onClick={() => {
                      setShowSearchModal(false);
                      setSearchQuery('');
                      handleMovieClick(item);
                    }}>
                    <img 
                      src={`${IMG_URL}${item.poster_path}`}
                      alt={item.title}
                    />
                    <div className="search-result-info">
                      <h3>{item.title}</h3>
                      <p>
                        {item.release_date?.split('-')[0] || 'N/A'} • 
                        {item.media_type === 'movie' ? ' Movie' : ' TV Series'}
                      </p>
                      <div className="search-result-rating">
                        {item.vote_average?.toFixed(1)} ★
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppWrapper;