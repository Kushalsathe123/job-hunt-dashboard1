
// Environment-specific configuration

// In a production environment, these values would be injected at build time
// or fetched from environment variables

// Development placeholder URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Configuration for different environments
export const config = {
  // API timeouts
  apiTimeout: 30000, // 30 seconds

  // Feature flags
  features: {
    enableNotifications: false,
    enableFilters: true,
    enableSearch: true,
  },
};

// Auth config (for future implementation)
export const authConfig = {
  storageKey: "student_job_tracker_auth",
  tokenExpiryTime: 24 * 60 * 60 * 1000, // 24 hours
};
