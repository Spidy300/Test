document.addEventListener('DOMContentLoaded', async function() {
    const animeId = getAnimeId();
    if (!animeId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Fetch anime details
    const animeDetails = await fetchAnimeData(`info/${animeId}`);
    displayAnimeDetails(animeDetails);
    
    // Fetch characters
    const characters = await fetchAnimeData(`characters/${animeId}`);
    displayCharacters(characters);
    
    // Fetch recommendations
    const recommendations = await fetchAnimeData(`recommendations/${animeId}`);
    displayRecommendations(recommendations);
});

function displayAnimeDetails(anime) {
    const detailsContainer = document.getElementById('anime-details');
    if (!detailsContainer || !anime) return;
    
    detailsContainer.innerHTML = `
        <div class="anime-poster">
            <img src="${anime.image}" alt="${anime.title}">
        </div>
        <div class="anime-content">
            <h1 class="anime-title">${anime.title}</h1>
            <div class="anime-meta">
                <span><i class="fas fa-star"></i> ${anime.rating || 'N/A'}</span>
                <span><i class="fas fa-calendar"></i> ${anime.releaseDate || 'N/A'}</span>
                <span><i class="fas fa-tv"></i> ${anime.type || 'N/A'}</span>
                <span><i class="fas fa-flag"></i> ${anime.status || 'N/A'}</span>
            </div>
            <div class="anime-description">
                <p>${anime.description || 'No description available.'}</p>
            </div>
            <div class="anime-genres">
                ${anime.genres?.map(genre => `<span class="genre-tag">${genre}</span>`).join('') || ''}
            </div>
            <button class="btn" onclick="location.href='episodes.html?id=${anime.id}'">Watch Now</button>
        </div>
    `;
}

function displayCharacters(characters) {
    const charactersContainer = document.getElementById('characters');
    if (!charactersContainer || !characters) return;
    
    charactersContainer.innerHTML = characters.slice(0, 10).map(character => `
        <div class="character-card">
            <img src="${character.image}" alt="${character.name}">
            <div class="character-info">
                <h5>${character.name}</h5>
                <p>${character.role}</p>
            </div>
        </div>
    `).join('');
}

function displayRecommendations(recommendations) {
    const recommendationsContainer = document.getElementById('recommendations');
    if (!recommendationsContainer || !recommendations) return;
    
    recommendationsContainer.innerHTML = recommendations.slice(0, 5).map(anime => `
        <div class="anime-card" data-id="${anime.id}">
            <img src="${anime.image}" alt="${anime.title}">
            <div class="anime-info">
                <h4>${anime.title}</h4>
                <p>${anime.type} • ${anime.releaseDate || 'N/A'}</p>
            </div>
        </div>
    `).join('');
}