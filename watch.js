document.addEventListener('DOMContentLoaded', async function() {
    const animeId = getAnimeId();
    const episodeId = getEpisodeId();
    
    if (!animeId || !episodeId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Fetch anime info for title
    const animeInfo = await fetchAnimeData(`info/${animeId}`);
    document.getElementById('watch-title').textContent = animeInfo.title;
    
    // Fetch episodes for sidebar
    const episodesData = await fetchAnimeData(`episodes/${animeId}`);
    displayEpisodeSidebar(episodesData, episodeId);
    
    // Fetch streaming sources
    const sources = await fetchStreamingSources(animeId, episodeId);
    setupVideoPlayer(sources);
    
    // Setup navigation buttons
    setupEpisodeNavigation(episodesData, episodeId);
});

function displayEpisodeSidebar(episodes, currentEpisodeId) {
    const sidebar = document.getElementById('episodes-sidebar');
    if (!sidebar || !episodes) return;
    
    sidebar.innerHTML = episodes.map(episode => `
        <a href="watch.html?id=${getAnimeId()}&episode=${episode.id}" 
           class="episode-sidebar-item ${episode.id === currentEpisodeId ? 'active' : ''}">
            Episode ${episode.number}: ${episode.title || ''}
        </a>
    `).join('');
}

function setupVideoPlayer(sources) {
    const videoPlayer = document.getElementById('anime-video');
    if (!videoPlayer || !sources) return;
    
    // Find the best quality source (simplified)
    const bestSource = sources.find(source => source.quality === '1080p') || 
                      sources.find(source => source.quality === '720p') || 
                      sources[0];
    
    if (bestSource) {
        videoPlayer.src = bestSource.url;
        videoPlayer.load();
    }
}

function setupEpisodeNavigation(episodes, currentEpisodeId) {
    const currentIndex = episodes.findIndex(ep => ep.id === currentEpisodeId);
    
    const prevBtn = document.getElementById('prev-episode');
    const nextBtn = document.getElementById('next-episode');
    
    if (currentIndex > 0) {
        const prevEpisode = episodes[currentIndex - 1];
        prevBtn.onclick = () => {
            window.location.href = `watch.html?id=${getAnimeId()}&episode=${prevEpisode.id}`;
        };
    } else {
        prevBtn.disabled = true;
    }
    
    if (currentIndex < episodes.length - 1) {
        const nextEpisode = episodes[currentIndex + 1];
        nextBtn.onclick = () => {
            window.location.href = `watch.html?id=${getAnimeId()}&episode=${nextEpisode.id}`;
        };
    } else {
        nextBtn.disabled = true;
    }
}