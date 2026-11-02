// Determine the API base URL:
// 1. If VITE_API_BASE_URL is provided, normalize it (ensuring https:// if it's a domain, and /api suffix)
// 2. Otherwise default to local backend
function resolveApiBase() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) {
    return "http://127.0.0.1:8000/api";
  }
  let base = envUrl.trim();
  if (!base.startsWith("http://") && !base.startsWith("https://")) {
    base = `https://${base}`;
  }
  if (!base.endsWith("/api")) {
    base = base.replace(/\/+$/, "") + "/api";
  }
  return base;
}

const API_BASE = resolveApiBase();

function getAuthHeader() {
  const token = localStorage.getItem("ecotrace_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorDetail = "An unexpected error occurred.";
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      errorDetail = `Request failed with status ${response.status}: ${response.statusText}`;
    }

    if (response.status === 401) {
      localStorage.removeItem("ecotrace_token");
      localStorage.removeItem("ecotrace_user");
    }

    const err = new Error(errorDetail);
    err.status = response.status;
    throw err;
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data) => request("/auth/register", { method: "POST", body: data }),
  login: (data) => request("/auth/login", { method: "POST", body: data }),
  getMe: () => request("/auth/me"),
  forgotPassword: (email) => request("/auth/forgot-password", { method: "POST", body: { email } }),

  // Profile & Onboarding
  getApplianceCatalog: () => request("/profile/appliances/catalog"),
  addCustomAppliance: (data) => request("/profile/appliances/custom", { method: "POST", body: data }),
  completeOnboarding: (data) => request("/profile/onboarding", { method: "POST", body: data }),
  getHousehold: () => request("/profile/household"),
  updateHousehold: (data) => request("/profile/household", { method: "PUT", body: data }),
  addHouseholdAppliance: (data) => request("/profile/household/appliances", { method: "POST", body: data }),
  deleteHouseholdAppliance: (id) => request(`/profile/household/appliances/${id}`, { method: "DELETE" }),
  updateBudgetTarget: (daily_co2_target_kg) => request("/profile/budget-target", { method: "PUT", body: { daily_co2_target_kg } }),
  updateSettings: (data) => request("/profile/settings", { method: "PUT", body: data }),
  updateProfile: (data) => request("/profile/settings", { method: "PUT", body: data }),
  getUserAchievements: () => request("/profile/achievements"),

  // Activities
  estimateEmissions: (data) => request("/activities/estimate", { method: "POST", body: data }),
  logActivity: (data) => request("/activities/", { method: "POST", body: data }),
  getActivities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/activities/${query ? `?${query}` : ""}`);
  },
  updateActivity: (id, data) => request(`/activities/${id}`, { method: "PUT", body: data }),
  deleteActivity: (id) => request(`/activities/${id}`, { method: "DELETE" }),

  // Dashboard
  getDashboardSummary: () => request("/dashboard/"),
  verifyDayTracking: () => request("/dashboard/verify-day", { method: "POST" }),

  // Analytics
  getAnalytics: (rangeType = "7d", startDate = null, endDate = null) => {
    let url = `/analytics/?range_type=${rangeType}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;
    return request(url);
  },
  getExportCsvUrl: () => `${API_BASE}/analytics/export-csv`,

  // Rewards
  getRewards: () => request("/rewards/"),
  redeemReward: (reward_id) => request("/rewards/redeem", { method: "POST", body: { reward_id } }),
  revealScratchCard: (redemption_id) => request(`/rewards/reveal/${redemption_id}`, { method: "POST" }),
  getCreditTransactions: () => request("/rewards/transactions"),

  // Leaderboard
  getLeaderboard: (timeframe = "weekly") => request(`/leaderboard/?timeframe=${timeframe}`),

  // Calculation Documentation
  getCalculationsInfo: () => request("/calculations/info"),
};

export default api;
