import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import conversionService from "../../services/conversionService";
import Swal from "sweetalert2";

// Thunks
export const loadConversions = createAsyncThunk(
  "conversions/load", 
  async (websiteId = null, { rejectWithValue, getState }) => {
    try {
      // Si no se proporciona un website_id específico, usar el seleccionado en el estado global
      if (!websiteId) {
        const { websites } = getState();
        if (websites.selectedWebsite) {
          websiteId = websites.selectedWebsite.id;
          console.log('loadConversions: usando websiteId del estado global:', websiteId);
        }
      }
      
      const response = await conversionService.getAll(websiteId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getConversionById = createAsyncThunk(
  "conversions/getById", 
  async (id, { rejectWithValue }) => {
    try {
      const response = await conversionService.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createConversion = createAsyncThunk(
  "conversions/create", 
  async (data, { rejectWithValue }) => {
    try {
      const response = await conversionService.create(data);
      Swal.fire({
        title: "¡Éxito!",
        text: "Conversión creada correctamente",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      return response.data.data;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al crear la conversión",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateConversion = createAsyncThunk(
  "conversions/update", 
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await conversionService.update(id, data);
      Swal.fire({
        title: "¡Éxito!",
        text: "Conversión actualizada correctamente",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      return { id, ...response.data.data };
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al actualizar la conversión",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Alias para mantener compatibilidad con código existente
export const editConversion = updateConversion;

export const incrementConversion = createAsyncThunk(
  "conversions/increment", 
  async ({ id, value = 1 }, { rejectWithValue }) => {
    try {
      const response = await conversionService.increment(id, value);
      return response.data.data;
    } catch (error) {
      console.error("Error al incrementar conversión:", error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteConversion = createAsyncThunk(
  "conversions/delete", 
  async (id, { rejectWithValue }) => {
    try {
      await conversionService.delete(id);
      Swal.fire({
        title: "¡Éxito!",
        text: "Conversión eliminada correctamente",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      return id;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al eliminar la conversión",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Estado inicial
const initialState = {
  conversions: [],
  selectedConversion: null,
  loading: false,
  error: null
};

// Slice
const conversionsSlice = createSlice({
  name: "conversions",
  initialState,
  reducers: {
    clearConversions: (state) => {
      state.conversions = [];
      state.error = null;
    },
    clearSelectedConversion: (state) => {
      state.selectedConversion = null;
    },
    setSelectedConversion: (state, action) => {
      state.selectedConversion = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load conversions
      .addCase(loadConversions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadConversions.fulfilled, (state, action) => {
        state.conversions = action.payload;
        state.loading = false;
      })
      .addCase(loadConversions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // En caso de error, limpiar la lista para evitar datos desactualizados
        state.conversions = [];
      })
      
      // Get conversion by ID
      .addCase(getConversionById.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedConversion = action.payload;
        }
      })
      
      // Create conversion
      .addCase(createConversion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversion.fulfilled, (state, action) => {
        state.conversions.push(action.payload);
        state.loading = false;
      })
      .addCase(createConversion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update conversion
      .addCase(updateConversion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateConversion.fulfilled, (state, action) => {
        const index = state.conversions.findIndex(
          (conv) => conv.id === parseInt(action.payload.id)
        );
        if (index !== -1) {
          state.conversions[index] = {
            ...state.conversions[index],
            ...action.payload
          };
        }
        state.loading = false;
      })
      .addCase(updateConversion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Increment conversion
      .addCase(incrementConversion.fulfilled, (state, action) => {
        const index = state.conversions.findIndex(
          (conv) => conv.id === parseInt(action.payload.id)
        );
        if (index !== -1) {
          state.conversions[index] = {
            ...state.conversions[index],
            ...action.payload
          };
        }
      })
      .addCase(incrementConversion.rejected, (state, action) => {
        console.error("Error al incrementar conversión:", action.payload);
      })
      
      // Delete conversion
      .addCase(deleteConversion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteConversion.fulfilled, (state, action) => {
        state.conversions = state.conversions.filter(
          (conv) => conv.id !== parseInt(action.payload)
        );
        state.loading = false;
      })
      .addCase(deleteConversion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearConversions, clearSelectedConversion, setSelectedConversion } = conversionsSlice.actions;
export default conversionsSlice.reducer;