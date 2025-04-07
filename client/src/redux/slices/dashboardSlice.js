import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDashboardStats, fetchLatestPosts, fetchLatestUsers } from "../../services/dashboardService";

export const loadDashboardData = createAsyncThunk(
  "dashboard/loadStats", 
  async (websiteId = null, { getState }) => {
    // Si no se proporciona un websiteId específico, usar el seleccionado en el estado global
    if (!websiteId) {
      const { websites } = getState();
      if (websites.selectedWebsite) {
        websiteId = websites.selectedWebsite.id;
      }
    }
    
    const stats = await fetchDashboardStats(websiteId);
    const posts = await fetchLatestPosts(websiteId);
    const users = await fetchLatestUsers(websiteId);
    
    return { stats, posts, users };
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: { stats: {}, posts: [], users: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadDashboardData.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
        state.posts = action.payload.posts;
        state.users = action.payload.users;
        state.loading = false;
      })
      .addCase(loadDashboardData.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default dashboardSlice.reducer;
