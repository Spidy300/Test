// API Configuration
const API_CONFIG = {
    consumet: {
        baseUrl: 'https://api.consumet.org/anime/gogoanime/',
        endpoints: {
            trending: 'trending',
            popular: 'popular',
            recent: 'recent-episodes',
            info: 'info/',
            episodes: 'episodes/',
            search: 'search?query=',
            recommendations: 'recommendations/',
            characters: 'characters/'
        }
    },
    aniwatch: {
        baseUrl: 'https://api.amvstr.me/api/v2/', // Alternative API
        endpoints: {
            stream: 'episode/'
        }
    }
};

// Common functions used across all pages
document.addEventListener('DOMContentLoaded', function() {
    // Toggle mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Check authentication status
    checkAuthStatus();
    
    // Store anime ID when clicking on anime card
    document.addEventListener('click', function(e) {
        const animeCard = e.target.closest('.anime-card');
        if (animeCard) {
            const animeId = animeCard.getAttribute('data-id');
            localStorage.setItem('selectedAnime', animeId);
        }
    });
});

// Authentication functions
function checkAuthStatus() {
    const authLinks = document.querySelector('.auth-links');
    const userLinks = document.querySelector('.user-links');
    const usernameSpan = document.querySelector('.username');
    
    if (!authLinks || !userLinks) return;
    
    const token = localStorage.getItem('authToken');
    if (token) {
        authLinks.style.display = 'none';
        userLinks.style.display = 'flex';
        const user = JSON.parse(localStorage.getItem('user'));
        if (usernameSpan && user) {
            usernameSpan.textContent = user.username;
        }
    } else {
        authLinks.style.display = 'flex';
        userLinks.style.display = 'none';
    }
}

// UI Helpers
function showLoading(container) {
    if (!container) return;
    container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
}

function showError(container, message) {
    if (!container) return;
    container.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message || 'Failed to load data. Please try again later.'}</p>
            <button class="btn retry-btn">Retry</button>
        </div>
    `;
    
    const retryBtn = container.querySelector('.retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', function() {
            window.location.reload();
        });
    }
}

// API Functions
async function fetchWithRetry(url, retries = 3, delay = 1000) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, retries - 1, delay * 2);
        }
        throw error;
    }
}

async function fetchAnimeData(endpoint, params = {}) {
    try {
        const url = new URL(API_CONFIG.consumet.endpoints[endpoint], API_CONFIG.consumet.baseUrl);
        
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key]) {
                    url.searchParams.append(key, params[key]);
                }
            });
        }
        
        console.log('Fetching:', url.toString());
        const data = await fetchWithRetry(url);
        console.log('API Response:', data);
        
        return data.results || data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}

async function fetchStreamingSources(animeId, episodeId) {
    try {
        const url = new URL(`${animeId}/${episodeId}`, 
                          `${API_CONFIG.aniwatch.baseUrl}${API_CONFIG.aniwatch.endpoints.stream}`);
        
        console.log('Fetching stream:', url.toString());
        const data = await fetchWithRetry(url);
        return data.sources || data;
    } catch (error) {
        console.error('Error fetching streaming sources:', error);
        throw error;
    }
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function getAnimeId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || localStorage.getItem('selectedAnime');
}

function getEpisodeId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('episode');
}

// User Functions
function isAuthenticated() {
    return !!localStorage.getItem('authToken');
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    checkAuthStatus();
    window.location.href = 'index.html';
}