

const storageService = {
  // Local Storage Operations
  setItem: (key, value) => {
    try {
      const stringValue = JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      return false;
    }
  },

  getItem: (key) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing from localStorage:", error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  },

  // Session Storage Operations
  setSessionItem: (key, value) => {
    try {
      const stringValue = JSON.stringify(value);
      sessionStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      console.error("Error saving to sessionStorage:", error);
      return false;
    }
  },

  getSessionItem: (key) => {
    try {
      const value = sessionStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Error reading from sessionStorage:", error);
      return null;
    }
  },

  removeSessionItem: (key) => {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing from sessionStorage:", error);
      return false;
    }
  },

  clearSession: () => {
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
      return false;
    }
  },

  // Cache Management
  setWithExpiry: (key, value, ttl) => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    return this.setItem(key, item);
  },

  getWithExpiry: (key) => {
    const item = this.getItem(key);

    if (!item) {
      return null;
    }

    const now = new Date();
    if (now.getTime() > item.expiry) {
      this.removeItem(key);
      return null;
    }

    return item.value;
  },

  // User-specific storage
  getUserPrefs: () => {
    const user = this.getItem("user");
    if (!user) return null;

    return this.getItem(`prefs_${user.id}`) || {};
  },

  setUserPrefs: (prefs) => {
    const user = this.getItem("user");
    if (!user) return false;

    const currentPrefs = this.getUserPrefs();
    const newPrefs = { ...currentPrefs, ...prefs };
    return this.setItem(`prefs_${user.id}`, newPrefs);
  },

  // Theme Management
  getTheme: () => {
    return this.getItem("theme") || "light";
  },

  setTheme: (theme) => {
    return this.setItem("theme", theme);
  },

  // Recent Searches
  getRecentSearches: () => {
    return this.getItem("recent_searches") || [];
  },

  addRecentSearch: (searchTerm) => {
    const searches = this.getRecentSearches();
    const filtered = searches.filter((term) => term !== searchTerm);
    const updated = [searchTerm, ...filtered].slice(0, 10); // Keep last 10
    return this.setItem("recent_searches", updated);
  },

  clearRecentSearches: () => {
    return this.removeItem("recent_searches");
  },

  // Draft Management
  saveDraft: (draftId, content) => {
    return this.setItem(`draft_${draftId}`, {
      content,
      timestamp: new Date().toISOString(),
    });
  },

  getDraft: (draftId) => {
    return this.getItem(`draft_${draftId}`);
  },

  deleteDraft: (draftId) => {
    return this.removeItem(`draft_${draftId}`);
  },

  // Notifications
  getUnreadNotifications: () => {
    return this.getItem("unread_notifications") || 0;
  },

  setUnreadNotifications: (count) => {
    return this.setItem("unread_notifications", count);
  },

  // App State
  saveAppState: (state) => {
    return this.setItem("app_state", {
      ...state,
      timestamp: new Date().toISOString(),
    });
  },

  getAppState: () => {
    const state = this.getItem("app_state");
    if (!state) return null;

    // Check if state is older than 1 hour
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const stateTime = new Date(state.timestamp);

    if (stateTime < hourAgo) {
      this.removeItem("app_state");
      return null;
    }

    return state;
  },
};

export default storageService;