import React, { useState, useEffect } from 'react';

function EpisodeList({ seriesId, onEpisodeSelect, currentSeason = 1 }) {
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(currentSeason);

  useEffect(() => {
    fetchSeasons();
  }, [seriesId]);

  useEffect(() => {
    if (selectedSeason) {
      fetchEpisodes(selectedSeason);
    }
  }, [selectedSeason]);

  async function fetchSeasons() {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
      );
      const data = await res.json();
      setSeasons(data.seasons || []);
    } catch (error) {
      console.error('Error fetching seasons:', error);
    }
  }

  async function fetchEpisodes(seasonNumber) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
      );
      const data = await res.json();
      setEpisodes(data.episodes || []);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  }

  return (
    <div className="episode-list">
      <div className="season-selector">
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
        >
          {seasons.map((season) => (
            <option key={season.season_number} value={season.season_number}>
              Season {season.season_number}
            </option>
          ))}
        </select>
      </div>

      <div className="episodes-grid">
        {episodes.map((episode) => (
          <div
            key={episode.episode_number}
            className="episode-card"
            onClick={() => onEpisodeSelect(selectedSeason, episode.episode_number)}
          >
            <div className="episode-thumbnail">
              {episode.still_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                  alt={episode.name}
                />
              ) : (
                <div className="episode-placeholder">
                  Episode {episode.episode_number}
                </div>
              )}
            </div>
            <div className="episode-info">
              <h4>Episode {episode.episode_number}</h4>
              <h3>{episode.name}</h3>
              <p>{episode.overview?.substring(0, 100)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EpisodeList;