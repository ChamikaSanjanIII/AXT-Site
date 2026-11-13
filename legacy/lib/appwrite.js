const API_BASE = typeof window !== 'undefined'
    ? '/api'
    : (process.env.NEXT_PUBLIC_API_URL || 'https://api1.clipgo.xyz/api');

// Fetch category count statistics dynamically
export const getCategoryStats = async () => {
    try {
        const response = await fetch(`${API_BASE}/categories/stats`);
        if (!response.ok) return [];
        return await response.json();
    } catch (e) {
        return [];
    }
};

// Fetch country count statistics dynamically
export const getCountryStats = async () => {
    try {
        const response = await fetch(`${API_BASE}/countries/stats`);
        if (!response.ok) return [];
        return await response.json();
    } catch (e) {
        return [];
    }
};

// Fetch latest videos grouped by top categories
export const getCategoryLatestSections = async () => {
    try {
        const response = await fetch(`${API_BASE}/categories/latest-sections`);
        if (!response.ok) return [];
        return await response.json();
    } catch (e) {
        return [];
    }
};

// Fetch search suggestions (autocomplete)
export const getSearchSuggestions = async (query) => {
    if (!query || query.trim().length === 0) return [];
    try {
        const response = await fetch(`${API_BASE}/videos/suggestions?q=${encodeURIComponent(query.trim())}`);
        if (!response.ok) return [];
        return await response.json();
    } catch (e) {
        return [];
    }
};

// Fetch one page of videos from backend (server-side pagination)
export const getVideosPage = async ({ page = 1, limit = 20, country = '', search = '', sort = 'latest' } = {}) => {
    try {
        const params = new URLSearchParams({ page, limit });
        if (country && country !== 'ALL') params.set('country', country);
        if (search) params.set('search', search);
        if (sort) params.set('sort', sort);

        const response = await fetch(`${API_BASE}/videos?${params}`);
        if (!response.ok) throw new Error(`Failed to fetch videos: ${response.statusText}`);
        const data = await response.json();
        // data = { videos: [...], pagination: { page, limit, total, totalPages } }
        return data;
    } catch (error) {
        console.error("Error fetching data from Backend:", error);
        return { videos: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } };
    }
};

// Fetch a single video by ID or slug (for direct URL access)
export const getVideoBySlug = async (idOrSlug) => {
    try {
        const response = await fetch(`${API_BASE}/videos/${encodeURIComponent(idOrSlug)}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        return null;
    }
};

// Function to submit a broken link report
export const submitReport = async (reportData) => {
    try {
        const response = await fetch(`${API_BASE}/reports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                videoId: reportData.videoId,
                videoTitle: reportData.videoTitle,
                reason: reportData.reason || reportData.captchaToken || 'Broken Link',
                captchaToken: reportData.captchaToken
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to submit report');
        }

        return await response.json();
    } catch (error) {
        console.error("Error submitting report:", error);
        throw error;
    }
};

// Function to increment and register a real view
export const incrementView = async (videoId) => {
    try {
        const response = await fetch(`${API_BASE}/videos/${videoId}/view`, {
            method: 'POST'
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        return null;
    }
};

// Function to register real like / dislike reactions
export const reactToVideo = async (videoId, action) => {
    try {
        const response = await fetch(`${API_BASE}/videos/${videoId}/react`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action })
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error sending reaction:", error);
        return null;
    }
};

// --- PORNSTAR APIS ---
export const getPornstars = async () => {
    try {
        const response = await fetch(`${API_BASE}/pornstars`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Error fetching pornstars:", error);
        return [];
    }
};

export const getPornstarProfile = async (slugOrId, { page = 1, limit = 24, tag = '' } = {}) => {
    try {
        const params = new URLSearchParams({ page, limit });
        if (tag) params.set('tag', tag);
        const response = await fetch(`${API_BASE}/pornstars/${encodeURIComponent(slugOrId)}?${params}`);
        if (!response.ok) throw new Error('Pornstar not found');
        return await response.json();
    } catch (error) {
        console.error("Error fetching pornstar profile:", error);
        return null;
    }
};

