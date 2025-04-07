import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import subcategoriaService from "../../services/subcategoriaService";
import Swal from "sweetalert2";

// Thunks
export const loadSubcategories = createAsyncThunk(
  "subcategories/load", 
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      // Si no se proporciona un website_id específico, usar el seleccionado en el estado global
      let websiteId = params.websiteId;
      if (!websiteId) {
        const { websites } = getState();
        if (websites.selectedWebsite) {
          websiteId = websites.selectedWebsite.id;
          console.log('loadSubcategories: usando websiteId del estado global:', websiteId);
        }
      }
      
      // Usar categoriaId si se proporciona
      const categoriaId = params.categoriaId || null;
      
      // Debug para verificar los parámetros
      console.log('loadSubcategories params:', { websiteId, categoriaId });
      
      const response = await subcategoriaService.getAll(websiteId, categoriaId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createSubcategory = createAsyncThunk("subcategories/create", async (data, { rejectWithValue }) => {
  try {
    const response = await subcategoriaService.create(data);
    Swal.fire({
      title: "¡Éxito!",
      text: "Subcategoría creada correctamente",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
    return response.data.data;
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Error al crear la subcategoría",
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateSubcategory = createAsyncThunk("subcategories/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await subcategoriaService.update(id, data);
    Swal.fire({
      title: "¡Éxito!",
      text: "Subcategoría actualizada correctamente",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
    return { id, ...response.data.data };
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Error al actualizar la subcategoría",
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteSubcategory = createAsyncThunk("subcategories/delete", async (id, { rejectWithValue }) => {
  try {
    await subcategoriaService.delete(id);
    Swal.fire({
      title: "¡Éxito!",
      text: "Subcategoría eliminada correctamente",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
    return id;
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Error al eliminar la subcategoría",
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Slice
const subcategoriesSlice = createSlice({
  name: "subcategories",
  initialState: { 
    subcategories: [], 
    loading: false, 
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load subcategories
      .addCase(loadSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSubcategories.fulfilled, (state, action) => {
        state.subcategories = action.payload;
        state.loading = false;
      })
      .addCase(loadSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create subcategory
      .addCase(createSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubcategory.fulfilled, (state, action) => {
        state.subcategories.push(action.payload);
        state.loading = false;
      })
      .addCase(createSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update subcategory
      .addCase(updateSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        const index = state.subcategories.findIndex(
          (sub) => sub.id_sub_categoria === parseInt(action.payload.id)
        );
        if (index !== -1) {
          state.subcategories[index] = {
            ...state.subcategories[index],
            ...action.payload
          };
        }
        state.loading = false;
      })
      .addCase(updateSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete subcategory
      .addCase(deleteSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubcategory.fulfilled, (state, action) => {
        state.subcategories = state.subcategories.filter(
          (sub) => sub.id_sub_categoria !== parseInt(action.payload)
        );
        state.loading = false;
      })
      .addCase(deleteSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default subcategoriesSlice.reducer;