import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "../../services/postService";
import Swal from "sweetalert2";

// Thunks
export const loadPosts = createAsyncThunk(
  "posts/load", 
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      // Si no se proporciona un website_id específico, usar el seleccionado en el estado global
      let websiteId = params.websiteId;
      if (!websiteId) {
        const { websites } = getState();
        if (websites.selectedWebsite) {
          websiteId = websites.selectedWebsite.id;
          console.log('loadPosts: usando websiteId del estado global:', websiteId);
        }
      }
      
      // Construir parámetros de filtrado
      const queryParams = {
        websiteId,
        categoriaId: params.categoriaId || null,
        subcategoriaId: params.subcategoriaId || null,
        subsubcategoriaId: params.subsubcategoriaId || null,
        estado: params.estado || null
      };
      
      // Debug para verificar los parámetros
      console.log('loadPosts params:', queryParams);
      
      const response = await postService.getAll(queryParams);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createPost = createAsyncThunk("posts/create", async (data, { rejectWithValue }) => {
  try {
    const response = await postService.create(data);
    Swal.fire({
      title: "¡Éxito!",
      text: "Post creado correctamente",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
    return response.data.data;
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Error al crear el post",
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updatePost = createAsyncThunk("posts/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await postService.update(id, data);
    Swal.fire({
      title: "¡Éxito!",
      text: "Post actualizado correctamente",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
    return { id, ...response.data.data };
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Error al actualizar el post",
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Alias para mantener compatibilidad con código existente
export const editPost = updatePost;

export const deletePost = createAsyncThunk("posts/delete", async (id, { rejectWithValue }) => {
  try {
    await postService.delete(id);
    Swal.fire({
      title: "¡Éxito!",
      text: "Post eliminado correctamente",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
    return id;
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Error al eliminar el post",
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Slice
const postsSlice = createSlice({
  name: "posts",
  initialState: { 
    posts: [], 
    loading: false, 
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load posts
      .addCase(loadPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(loadPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
        state.loading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post.id_post === parseInt(action.payload.id)
        );
        if (index !== -1) {
          state.posts[index] = {
            ...state.posts[index],
            ...action.payload
          };
        }
        state.loading = false;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post.id_post !== parseInt(action.payload)
        );
        state.loading = false;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postsSlice.reducer;