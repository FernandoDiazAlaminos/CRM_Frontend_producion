import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import analyticService from "../../services/analyticService";

// Thunks
export const loadAnalyticsData = createAsyncThunk(
  "analytics/loadData", 
  async ({ websiteId, startDate, endDate }, { rejectWithValue, getState }) => {
    try {
      // Si no se proporciona un website_id específico, usar el seleccionado en el estado global
      if (!websiteId) {
        const { websites } = getState();
        if (websites.selectedWebsite) {
          websiteId = websites.selectedWebsite.id;
          console.log('loadAnalyticsData: usando websiteId del estado global:', websiteId);
        }
      }
      
      const response = await analyticService.getAnalyticsData(websiteId, startDate, endDate);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loadAdsData = createAsyncThunk(
  "analytics/loadAdsData", 
  async ({ websiteId, startDate, endDate }, { rejectWithValue, getState }) => {
    try {
      // Si no se proporciona un website_id específico, usar el seleccionado en el estado global
      if (!websiteId) {
        const { websites } = getState();
        if (websites.selectedWebsite) {
          websiteId = websites.selectedWebsite.id;
          console.log('loadAdsData: usando websiteId del estado global:', websiteId);
        }
      }
      
      const response = await analyticService.getAdsData(websiteId, startDate, endDate);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Estado inicial
const initialState = {
  analyticsData: {
    overview: {},
    visitors: {},
    trafficSources: {},
    pagePerformance: [],
    conversions: {}
  },
  adsData: [],
  analyticsLoading: false,
  adsLoading: false,
  error: null
};

// Slice
const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearAnalyticsData: (state) => {
      state.analyticsData = {
        overview: {},
        visitors: {},
        trafficSources: {},
        pagePerformance: [],
        conversions: {}
      };
      state.error = null;
    },
    clearAdsData: (state) => {
      state.adsData = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Analytics Data
      .addCase(loadAnalyticsData.pending, (state) => {
        state.analyticsLoading = true;
        state.error = null;
      })
      .addCase(loadAnalyticsData.fulfilled, (state, action) => {
        state.analyticsData = action.payload;
        state.analyticsLoading = false;
      })
      .addCase(loadAnalyticsData.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.error = action.payload;
        console.error("Error al cargar datos de Analytics:", action.payload);
      })

      // Google Ads Data
      .addCase(loadAdsData.pending, (state) => {
        state.adsLoading = true;
        state.error = null;
      })
      .addCase(loadAdsData.fulfilled, (state, action) => {
        state.adsData = action.payload;
        state.adsLoading = false;
      })
      .addCase(loadAdsData.rejected, (state, action) => {
        state.adsLoading = false;
        state.error = action.payload;
        console.error("Error al cargar datos de Google Ads:", action.payload);
      });
  },
});

export const { clearAnalyticsData, clearAdsData } = analyticsSlice.actions;
export default analyticsSlice.reducer;