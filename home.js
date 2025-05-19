document.addEventListener('DOMContentLoaded', async function() {
    const trendingContainer = document.getElementById('trending-anime');
    const popularContainer = document.getElementById('popular-anime');
    const recentContainer = document.getElementById('recent-anime');
    
    // Show loading states
    showLoading(trendingContainer);
    showLoading(popularContainer);
    showLoading(recentContainer);
    
    try {
        // Fetch data with error handling for each section
        try {
            const trending = await fetchAnimeData('trending');
            displayAnimeGrid(trending.slice(0, 10), 'trending-anime', 'Trending Now');
        } catch (error) {
            console.error('Trending anime error:', error);
            showError(trendingContainer, 'Failed to load trending anime');
        }
        
        try {
            const popular = await fetchAnimeData('popular');
            displayAnimeGrid(popular.slice(0, 10), 'popular-anime', 'Popular Anime');
        } catch (error) {
            console.error('Popular anime error:', error);
            showError(popularContainer, 'Failed to load popular anime');
        }
        
        try {
            const recent = await fetchAnimeData('recent-episodes');
            displayAnimeGrid(recent.slice(0, 10), 'recent-anime', 'Recently Updated');
        } catch (error) {
            console.error('Recent anime error:', error);
            showError(recentContainer, 'Failed to load recent anime');
        }
    } catch (error) {
        console.error('Global error:', error);
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');
    
    searchBtn.addEventListener('click', async function() {
        const query = searchInput.value.trim();
        if (query) {
            try {
                const searchResults = await fetchAnimeData('search', { query });
                localStorage.setItem('searchResults', JSON.stringify(searchResults));
                window.location.href = 'search.html';
            } catch (error) {
                console.error('Search error:', error);
                alert('Search failed: ' + error.message);
            }
        }
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
});

function displayAnimeGrid(animeList, elementId, sectionTitle) {
    const gridContainer = document.getElementById(elementId);
    if (!gridContainer) return;
    
    if (!animeList || animeList.length === 0) {
        gridContainer.innerHTML = '<p>No anime found</p>';
        return;
    }
    
    gridContainer.innerHTML = animeList.map(anime => {
        const title = anime.title?.english || anime.title?.romaji || anime.title?.native || 'Unknown Title';
        const image = anime.image || 'assets/no-image.jpg';
        const id = anime.id;
        
        return `
            <div class="anime-card" data-id="${id}">
                <div class="anime-card-image">
                    <img src="${image}" alt="${title}" onerror="this.src='assets/no-image.jpg'">
                </div>
                <div class="anime-info">
                    <h4>${title}</h4>
                    <p>${anime.type || 'TV'} • ${anime.releaseDate ? formatDate(anime.releaseDate) : 'N/A'}</p>
                </div>
            </div>
        `;
    }).join('');
    
    if (sectionTitle) {
        const sectionHeader = gridContainer.previousElementSibling;
        if (sectionHeader && sectionHeader.tagName === 'H3') {
            sectionHeader.textContent = sectionTitle;
        }
    }
}