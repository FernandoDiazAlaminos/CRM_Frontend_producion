import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import subsubcategoriaService from "../../services/subsubcategoriaService";
import Swal from "sweetalert2";

// Thunks
export const loadSubsubcategories = createAsyncThunk(
  "subsubcategories/load", 
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      // Si no se proporciona un website_id específico, usar el seleccionado en el estado global
      let websiteId = params.websiteId;
      if (!websiteId) {
        const { websites } = getState();
        if (websites.selectedWebsite) {
          websiteId = websites.selectedWebsite.id;
          console.log('loadSubsubcategories: usando websiteId del estado global:', websiteId);
        }
      }
      
      // Usar subcategoriaId si se proporciona
      const subcategoriaId = params.subcategoriaId || null;
      
      // Debug para verificar los parámetros
      console.log('loadSubsubcategories params:', { websiteId, subcategoriaId });
      
      const response = await subsubcategoriaService.getAll(websiteId, subcategoriaId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createSubsubcategory = createAsyncThunk("subsubcategories/create", async (data, { rejectWithValue }) => {
  try {
    const response = await subsubcategoriaService.create(data);
    Swal.fire({
      title: "¡Éxito!",
      text: "Subsubcategoría creada correctamente",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
    return response.data.data;
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Error al crear la subsubcategoría",
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateSubsubcategory = createAsyncThunk("subsubcategories/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await subsubcategoriaService.update(id, data);
    Swal.fire({
      title: "¡Éxito!",
      text: "Subsubcategoría actualizada correctamente",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
    return { id, ...response.data.data };
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Error al actualizar la subsubcategoría",
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteSubsubcategory = createAsyncThunk("subsubcategories/delete", async (id, { rejectWithValue }) => {
  try {
    await subsubcategoriaService.delete(id);
    Swal.fire({
      title: "¡Éxito!",
      text: "Subsubcategoría eliminada correctamente",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
    return id;
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Error al eliminar la subsubcategoría",
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Slice
const subsubcategoriesSlice = createSlice({
  name: "subsubcategories",
  initialState: { 
    subsubcategories: [], 
    loading: false, 
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load subsubcategories
      .addCase(loadSubsubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSubsubcategories.fulfilled, (state, action) => {
        state.subsubcategories = action.payload;
        state.loading = false;
      })
      .addCase(loadSubsubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create subsubcategory
      .addCase(createSubsubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubsubcategory.fulfilled, (state, action) => {
        state.subsubcategories.push(action.payload);
        state.loading = false;
      })
      .addCase(createSubsubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update subsubcategory
      .addCase(updateSubsubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubsubcategory.fulfilled, (state, action) => {
        const index = state.subsubcategories.findIndex(
          (subsub) => subsub.id_sub_sub_categoria === parseInt(action.payload.id)
        );
        if (index !== -1) {
          state.subsubcategories[index] = {
            ...state.subsubcategories[index],
            ...action.payload
          };
        }
        state.loading = false;
      })
      .addCase(updateSubsubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete subsubcategory
      .addCase(deleteSubsubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubsubcategory.fulfilled, (state, action) => {
        state.subsubcategories = state.subsubcategories.filter(
          (subsub) => subsub.id_sub_sub_categoria !== parseInt(action.payload)
        );
        state.loading = false;
      })
      .addCase(deleteSubsubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default subsubcategoriesSlice.reducer;