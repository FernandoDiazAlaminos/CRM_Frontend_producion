import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import seoService from "../../services/seoService";
import Swal from "sweetalert2";

// ======= THUNKS PARA SEO DE ENTIDADES =======

export const loadSEOEntities = createAsyncThunk(
  "seo/loadEntities", 
  async (websiteId = null, { rejectWithValue, getState }) => {
    try {
      // Si no se proporciona un website_id específico, usar el seleccionado en el estado global
      if (!websiteId) {
        const { websites } = getState();
        if (websites.selectedWebsite) {
          websiteId = websites.selectedWebsite.id;
          console.log('loadSEOEntities: usando websiteId del estado global:', websiteId);
        }
      }
      
      const response = await seoService.getAllEntities(websiteId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getSEOByCategory = createAsyncThunk(
  "seo/getByCategory", 
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await seoService.getByCategory(categoryId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getSEOBySubcategory = createAsyncThunk(
  "seo/getBySubcategory", 
  async (subcategoryId, { rejectWithValue }) => {
    try {
      const response = await seoService.getBySubcategory(subcategoryId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getSEOBySubsubcategory = createAsyncThunk(
  "seo/getBySubsubcategory", 
  async (subsubcategoryId, { rejectWithValue }) => {
    try {
      const response = await seoService.getBySubsubcategory(subsubcategoryId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getSEOByPost = createAsyncThunk(
  "seo/getByPost", 
  async (postId, { rejectWithValue }) => {
    try {
      const response = await seoService.getByPost(postId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createSEOEntity = createAsyncThunk(
  "seo/createEntity", 
  async (data, { rejectWithValue }) => {
    try {
      const response = await seoService.createEntity(data);
      Swal.fire({
        title: "¡Éxito!",
        text: "Configuración SEO creada correctamente",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      return response.data.data;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al crear la configuración SEO",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateSEOEntity = createAsyncThunk(
  "seo/updateEntity", 
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await seoService.updateEntity(id, data);
      Swal.fire({
        title: "¡Éxito!",
        text: "Configuración SEO actualizada correctamente",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      return { id, ...response.data.data };
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al actualizar la configuración SEO",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Alias para mantener compatibilidad con código existente
export const editSEOEntity = updateSEOEntity;

export const deleteSEOEntity = createAsyncThunk(
  "seo/deleteEntity", 
  async (id, { rejectWithValue }) => {
    try {
      await seoService.deleteEntity(id);
      Swal.fire({
        title: "¡Éxito!",
        text: "Configuración SEO eliminada correctamente",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      return id;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al eliminar la configuración SEO",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ======= THUNKS PARA SEO DE PÁGINAS =======

export const loadSEOPages = createAsyncThunk(
  "seo/loadPages", 
  async (websiteId = null, { rejectWithValue, getState }) => {
    try {
      // Si no se proporciona un website_id específico, usar el seleccionado en el estado global
      if (!websiteId) {
        const { websites } = getState();
        if (websites.selectedWebsite) {
          websiteId = websites.selectedWebsite.id;
          console.log('loadSEOPages: usando websiteId del estado global:', websiteId);
        }
      }
      
      const response = await seoService.getAllPages(websiteId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getSEOPageById = createAsyncThunk(
  "seo/getPageById", 
  async (pageId, { rejectWithValue }) => {
    try {
      const response = await seoService.getPageById(pageId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createSEOPage = createAsyncThunk(
  "seo/createPage", 
  async (data, { rejectWithValue }) => {
    try {
      const response = await seoService.createPage(data);
      Swal.fire({
        title: "¡Éxito!",
        text: "Configuración SEO de página creada correctamente",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      return response.data.data;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al crear la configuración SEO de página",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateSEOPage = createAsyncThunk(
  "seo/updatePage", 
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await seoService.updatePage(id, data);
      Swal.fire({
        title: "¡Éxito!",
        text: "Configuración SEO de página actualizada correctamente",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      return { id, ...response.data.data };
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al actualizar la configuración SEO de página",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Alias para mantener compatibilidad con código existente
export const editSEOPage = updateSEOPage;

export const deleteSEOPage = createAsyncThunk(
  "seo/deletePage", 
  async (id, { rejectWithValue }) => {
    try {
      await seoService.deletePage(id);
      Swal.fire({
        title: "¡Éxito!",
        text: "Configuración SEO de página eliminada correctamente",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      return id;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al eliminar la configuración SEO de página",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Estado inicial
const initialState = {
  seoEntities: [],
  seoPages: [],
  selectedSEO: null,
  activeSEOType: 'pages', // 'pages' o 'entities'
  loading: false,
  error: null
};

// Slice
const seoSlice = createSlice({
  name: "seo",
  initialState,
  reducers: {
    setActiveSEOType: (state, action) => {
      state.activeSEOType = action.payload;
    },
    clearSelectedSEO: (state) => {
      state.selectedSEO = null;
    },
    setSelectedSEO: (state, action) => {
      state.selectedSEO = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // ===== SEO ENTIDADES =====
      // Cargar SEO Entidades
      .addCase(loadSEOEntities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSEOEntities.fulfilled, (state, action) => {
        state.seoEntities = action.payload;
        state.loading = false;
      })
      .addCase(loadSEOEntities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Obtener SEO por categoría/subcategoría/subsubcategoría/post
      .addCase(getSEOByCategory.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedSEO = action.payload;
        }
      })
      .addCase(getSEOBySubcategory.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedSEO = action.payload;
        }
      })
      .addCase(getSEOBySubsubcategory.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedSEO = action.payload;
        }
      })
      .addCase(getSEOByPost.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedSEO = action.payload;
        }
      })
      
      // Crear SEO Entidad
      .addCase(createSEOEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSEOEntity.fulfilled, (state, action) => {
        state.seoEntities.push(action.payload);
        state.loading = false;
      })
      .addCase(createSEOEntity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Actualizar SEO Entidad
      .addCase(updateSEOEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSEOEntity.fulfilled, (state, action) => {
        const index = state.seoEntities.findIndex(
          (entity) => entity.id === parseInt(action.payload.id)
        );
        if (index !== -1) {
          state.seoEntities[index] = {
            ...state.seoEntities[index],
            ...action.payload
          };
        }
        state.loading = false;
      })
      .addCase(updateSEOEntity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Eliminar SEO Entidad
      .addCase(deleteSEOEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSEOEntity.fulfilled, (state, action) => {
        state.seoEntities = state.seoEntities.filter(
          (entity) => entity.id !== parseInt(action.payload)
        );
        state.loading = false;
      })
      .addCase(deleteSEOEntity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ===== SEO PÁGINAS =====
      // Cargar SEO Páginas
      .addCase(loadSEOPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSEOPages.fulfilled, (state, action) => {
        state.seoPages = action.payload;
        state.loading = false;
      })
      .addCase(loadSEOPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Obtener SEO Página por ID
      .addCase(getSEOPageById.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedSEO = action.payload;
        }
      })
      
      // Crear SEO Página
      .addCase(createSEOPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSEOPage.fulfilled, (state, action) => {
        state.seoPages.push(action.payload);
        state.loading = false;
      })
      .addCase(createSEOPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Actualizar SEO Página
      .addCase(updateSEOPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSEOPage.fulfilled, (state, action) => {
        const index = state.seoPages.findIndex(
          (page) => page.id === parseInt(action.payload.id)
        );
        if (index !== -1) {
          state.seoPages[index] = {
            ...state.seoPages[index],
            ...action.payload
          };
        }
        state.loading = false;
      })
      .addCase(updateSEOPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Eliminar SEO Página
      .addCase(deleteSEOPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSEOPage.fulfilled, (state, action) => {
        state.seoPages = state.seoPages.filter(
          (page) => page.id !== parseInt(action.payload)
        );
        state.loading = false;
      })
      .addCase(deleteSEOPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveSEOType, clearSelectedSEO, setSelectedSEO } = seoSlice.actions;
export default seoSlice.reducer;