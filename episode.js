document.addEventListener('DOMContentLoaded', async function() {
    const animeId = getAnimeId();
    if (!animeId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Fetch anime info for title
    const animeInfo = await fetchAnimeData(`info/${animeId}`);
    document.getElementById('anime-title').textContent = animeInfo.title;
    
    // Fetch episodes
    const episodesData = await fetchAnimeData(`episodes/${animeId}`);
    displayEpisodes(episodesData);
});

function displayEpisodes(episodes) {
    const episodesContainer = document.getElementById('episodes-list');
    if (!episodesContainer || !episodes) return;
    
    episodesContainer.innerHTML = episodes.map(episode => `
        <a href="watch.html?id=${getAnimeId()}&episode=${episode.id}" class="episode-card">
            <h4>Episode ${episode.number}</h4>
            <p>${episode.title || 'Episode ' + episode.number}</p>
        </a>
    `).join('');
}