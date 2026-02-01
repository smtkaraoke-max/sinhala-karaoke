/**
 * SINHALA KARAOKE WEBSITE - MAIN JAVASCRIPT
 * Features: Dynamic Post Loading, Search, Category Filtering
 */

// ==========================================
// SAMPLE KARAOKE DATA
// In a real application, this could come from an API or JSON file
// ==========================================
const karaokeData = [
    {
        id: 1,
        title: "Tharuka Pelin Eha Karaoke - තාරුකා පෙළින් එහා",
        description: "Classic Sinhala karaoke track from the golden era. Perfect for classical music lovers.",
        category: "old",
        categoryLabel: "Old Songs",
        youtubeId: "akzAVhzQICs", // Replace with actual YouTube video IDs
        date: "2027-10-17",
        views: "168K"
    },
    {
        id: 2,
        title: "Maa Sanuuse - මා සනුසේ (New Release)",
        description: "Latest Sinhala karaoke song. Popular among young singers.",
        category: "new",
        categoryLabel: "New Uploads",
        youtubeId: "dQw4w9WgXcQ",
        date: "2024-01-20",
        views: "8.5K"
    },
    {
        id: 3,
        title: "Sudu Hamine - සුදු හැමිනේ (Movie Song)",
        description: "From the blockbuster movie 'Sarigama'. Beautiful melody for karaoke.",
        category: "movie",
        categoryLabel: "Movie Songs",
        youtubeId: "dQw4w9WgXcQ",
        date: "2024-01-10",
        views: "25K"
    },
    {
        id: 4,
        title: "Dura Atha Niwasanna - දුර අථ නිවසන්න",
        description: "Evergreen classic by Amarasiri Peiris. Emotional ballad.",
        category: "classic",
        categoryLabel: "Classics",
        youtubeId: "dQw4w9WgXcQ",
        date: "2023-12-28",
        views: "45K"
    },
    {
        id: 5,
        title: "Gimhanaayaka - ගිම්හනායක (Pop Version)",
        description: "Modern pop karaoke version of the traditional favorite.",
        category: "pop",
        categoryLabel: "Pop Songs",
        youtubeId: "dQw4w9WgXcQ",
        date: "2024-01-18",
        views: "15K"
    },
    {
        id: 6,
        title: "Pem Kekula - පෙම් කෙකුලා",
        description: "Romantic old classic perfect for couples karaoke night.",
        category: "old",
        categoryLabel: "Old Songs",
        youtubeId: "dQw4w9WgXcQ",
        date: "2023-12-15",
        views: "32K"
    },
    {
        id: 7,
        title: "Ninda Nena Rathri - නින්ද නෙනා රාත්‍රී",
        description: "Latest movie soundtrack. Very popular on our channel.",
        category: "movie",
        categoryLabel: "Movie Songs",
        youtubeId: "dQw4w9WgXcQ",
        date: "2024-01-22",
        views: "18K"
    },
    {
        id: 8,
        title: "Sudu Hamine - සුදු හැමිනේ (Acoustic)",
        description: "Acoustic version of the popular song. Easy to sing along.",
        category: "new",
        categoryLabel: "New Uploads",
        youtubeId: "dQw4w9WgXcQ",
        date: "2024-01-25",
        views: "5K"
    }
];

// ==========================================
// STATE MANAGEMENT
// ==========================================
let currentState = {
    posts: karaokeData,
    filteredPosts: karaokeData,
    currentCategory: 'all',
    searchTerm: '',
    postsPerPage: 6,
    currentPage: 1
};

// ==========================================
// DOM ELEMENTS
// ==========================================
const elements = {
    postsGrid: document.getElementById('postsGrid'),
    popularList: document.getElementById('popularList'),
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    categoryButtons: document.querySelectorAll('.category-btn'),
    filterStatus: document.getElementById('filterStatus'),
    filterText: document.getElementById('filterText'),
    clearFilter: document.getElementById('clearFilter'),
    noResults: document.getElementById('noResults'),
    loadMoreBtn: document.getElementById('loadMoreBtn'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    navMenu: document.getElementById('navMenu')
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderPosts();
    renderPopularSongs();
    setupEventListeners();
    setupMobileMenu();
}

// ==========================================
// RENDER FUNCTIONS
// ==========================================

/**
 * Render karaoke posts to the grid
 */
function renderPosts() {
    const { filteredPosts, currentPage, postsPerPage } = currentState;
    
    // Clear current posts
    elements.postsGrid.innerHTML = '';
    
    // Calculate pagination
    const endIndex = currentPage * postsPerPage;
    const postsToShow = filteredPosts.slice(0, endIndex);
    
    if (postsToShow.length === 0) {
        elements.noResults.style.display = 'block';
        elements.loadMoreBtn.style.display = 'none';
        return;
    } else {
        elements.noResults.style.display = 'none';
    }
    
    // Generate HTML for each post
    postsToShow.forEach((post, index) => {
        const postCard = createPostCard(post, index);
        elements.postsGrid.appendChild(postCard);
    });
    
    // Show/hide load more button
    if (endIndex >= filteredPosts.length) {
        elements.loadMoreBtn.style.display = 'none';
    } else {
        elements.loadMoreBtn.style.display = 'inline-block';
    }
}

/**
 * Create individual post card HTML element
 */
function createPostCard(post, index) {
    const card = document.createElement('article');
    card.className = 'post-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="video-wrapper">
            <iframe 
                src="https://www.youtube.com/embed/${post.youtubeId}" 
                title="${post.title}"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                loading="lazy">
            </iframe>
        </div>
        <div class="post-content">
            <span class="post-category">${post.categoryLabel}</span>
            <h2 class="post-title">${post.title}</h2>
            <p class="post-description">${post.description}</p>
            <div class="post-meta">
                <span class="post-date">📅 ${formatDate(post.date)}</span>
                <span class="post-views">👁️ ${post.views} views</span>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Render popular songs in sidebar
 */
function renderPopularSongs() {
    // Sort by views and take top 5
    const popularSongs = [...karaokeData]
        .sort((a, b) => parseViews(b.views) - parseViews(a.views))
        .slice(0, 5);
    
    elements.popularList.innerHTML = '';
    
    popularSongs.forEach(song => {
        const item = document.createElement('li');
        item.className = 'popular-item';
        item.innerHTML = `
            <div class="popular-thumb">
                <img src="https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg" alt="${song.title}">
            </div>
            <div class="popular-info">
                <h5>${truncateText(song.title, 40)}</h5>
                <p>▶️ ${song.views} views</p>
            </div>
        `;
        
        // Add click to filter by this song (simulated)
        item.addEventListener('click', () => {
            elements.searchInput.value = song.title.split(' - ')[0];
            handleSearch();
        });
        
        elements.popularList.appendChild(item);
    });
}

// ==========================================
// EVENT HANDLERS
// ==========================================

function setupEventListeners() {
    // Search functionality
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
        // Real-time search (optional - can be removed if performance is concern)
        // handleSearch();
    });
    
    // Category filtering
    elements.categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            handleCategoryFilter(category, this);
        });
    });
    
    // Clear filter
    elements.clearFilter.addEventListener('click', resetFilters);
    
    // Load more
    elements.loadMoreBtn.addEventListener('click', loadMorePosts);
    
    // Nav links filter
    document.querySelectorAll('.nav-link[data-category]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            // Find corresponding category button and trigger click
            const categoryBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
            if (categoryBtn) {
                categoryBtn.click();
            }
            // Close mobile menu if open
            elements.navMenu.classList.remove('active');
            elements.mobileMenuBtn.classList.remove('active');
            // Scroll to content
            document.querySelector('.main-container').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/**
 * Handle search functionality
 */
function handleSearch() {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    currentState.searchTerm = searchTerm;
    currentState.currentPage = 1;
    
    filterPosts();
    updateFilterStatus();
}

/**
 * Handle category filtering
 */
function handleCategoryFilter(category, clickedBtn) {
    // Update active state on buttons
    elements.categoryButtons.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
    
    currentState.currentCategory = category;
    currentState.currentPage = 1;
    
    filterPosts();
    updateFilterStatus();
    
    // Scroll to posts on mobile
    if (window.innerWidth <= 968) {
        document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Filter posts based on search and category
 */
function filterPosts() {
    const { posts, searchTerm, currentCategory } = currentState;
    
    currentState.filteredPosts = posts.filter(post => {
        // Search filter
        const matchesSearch = !searchTerm || 
            post.title.toLowerCase().includes(searchTerm) ||
            post.description.toLowerCase().includes(searchTerm);
        
        // Category filter
        const matchesCategory = currentCategory === 'all' || post.category === currentCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    renderPosts();
}

/**
 * Update filter status display
 */
function updateFilterStatus() {
    const { searchTerm, currentCategory, filteredPosts } = currentState;
    
    if (searchTerm || currentCategory !== 'all') {
        elements.filterStatus.style.display = 'flex';
        let filterText = '';
        
        if (currentCategory !== 'all') {
            const categoryLabel = document.querySelector(`.category-btn[data-category="${currentCategory}"]`).textContent;
            filterText += `Category: ${categoryLabel}`;
        }
        
        if (searchTerm) {
            if (filterText) filterText += ' | ';
            filterText += `Search: "${searchTerm}"`;
        }
        
        filterText += ` (${filteredPosts.length} results)`;
        elements.filterText.textContent = filterText;
    } else {
        elements.filterStatus.style.display = 'none';
    }
}

/**
 * Reset all filters
 */
function resetFilters() {
    currentState.searchTerm = '';
    currentState.currentCategory = 'all';
    currentState.currentPage = 1;
    elements.searchInput.value = '';
    
    // Reset category buttons
    elements.categoryButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.category-btn[data-category="all"]').classList.add('active');
    
    filterPosts();
    updateFilterStatus();
}

/**
 * Load more posts (pagination)
 */
function loadMorePosts() {
    currentState.currentPage++;
    renderPosts();
}

// ==========================================
// MOBILE MENU
// ==========================================

function setupMobileMenu() {
    elements.mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        elements.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = elements.navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            elements.navMenu.classList.remove('active');
            elements.mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Format date to readable string
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Parse view count string to number
 */
function parseViews(viewsString) {
    const num = parseFloat(viewsString.replace(/[^0-9.]/g, ''));
    if (viewsString.includes('K')) return num * 1000;
    if (viewsString.includes('M')) return num * 1000000;
    return num;
}

/**
 * Truncate text to specified length
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// ==========================================
// ERROR HANDLING
// ==========================================

window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo);
    return false;

};
