import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoriaService from "../../services/categoriaService";
import Swal from "sweetalert2";

// Thunks
export const loadCategories = createAsyncThunk(
  "categories/load", 
  async (websiteId = null, { rejectWithValue, getState }) => {
    try {
      // Si no se proporciona un website_id específico, usar el seleccionado en el estado global
      if (!websiteId) {
        const { websites } = getState();
        if (websites.selectedWebsite) {
          websiteId = websites.selectedWebsite.id;
          console.log('loadCategories: usando websiteId del estado global:', websiteId);
        }
      }
      
      // Debug para verificar el ID de sitio que se está usando
      console.log('loadCategories: websiteId final:', websiteId);
      
      const response = await categoriaService.getAll(websiteId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createCategory = createAsyncThunk("categories/create", async (data, { rejectWithValue }) => {
  try {
    const response = await categoriaService.create(data);
    Swal.fire({
      title: "¡Éxito!",
      text: "Categoría creada correctamente",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
    return response.data.data;
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Error al crear la categoría",
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateCategory = createAsyncThunk("categories/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await categoriaService.update(id, data);
    Swal.fire({
      title: "¡Éxito!",
      text: "Categoría actualizada correctamente",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
    return { id, ...response.data.data };
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Error al actualizar la categoría",
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteCategory = createAsyncThunk("categories/delete", async (id, { rejectWithValue }) => {
  try {
    await categoriaService.delete(id);
    Swal.fire({
      title: "¡Éxito!",
      text: "Categoría eliminada correctamente",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
    return id;
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Error al eliminar la categoría",
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Slice
const categoriesSlice = createSlice({
  name: "categories",
  initialState: { 
    categories: [], 
    loading: false, 
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load categories
      .addCase(loadCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
        state.loading = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (cat) => cat.id_categoria === parseInt(action.payload.id)
        );
        if (index !== -1) {
          state.categories[index] = {
            ...state.categories[index],
            ...action.payload
          };
        }
        state.loading = false;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat.id_categoria !== parseInt(action.payload)
        );
        state.loading = false;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categoriesSlice.reducer;