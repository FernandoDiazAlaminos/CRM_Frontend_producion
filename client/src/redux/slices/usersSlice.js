import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";
import Swal from "sweetalert2";

// Thunks
export const loadUsers = createAsyncThunk(
  "users/load", 
  async (websiteId = null, { rejectWithValue, getState }) => {
    try {
      // Si no se proporciona un website_id específico, usar el seleccionado en el estado global
      if (!websiteId) {
        const { websites } = getState();
        if (websites.selectedWebsite) {
          websiteId = websites.selectedWebsite.id;
          console.log('loadUsers: usando websiteId del estado global:', websiteId);
        }
      }
      
      const response = await userService.getAll(websiteId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getUserById = createAsyncThunk(
  "users/getById", 
  async (id, { rejectWithValue }) => {
    try {
      const response = await userService.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  "users/create", 
  async (data, { rejectWithValue }) => {
    try {
      const response = await userService.create(data);
      Swal.fire({
        title: "¡Éxito!",
        text: "Usuario creado correctamente",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      return response.data.data;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al crear el usuario",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update", 
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await userService.update(id, data);
      Swal.fire({
        title: "¡Éxito!",
        text: "Usuario actualizado correctamente",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      return { id, ...response.data.data };
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al actualizar el usuario",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Alias para mantener compatibilidad con código existente
export const editUser = updateUser;

export const deleteUser = createAsyncThunk(
  "users/delete", 
  async (id, { rejectWithValue }) => {
    try {
      await userService.delete(id);
      Swal.fire({
        title: "¡Éxito!",
        text: "Usuario eliminado correctamente",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      return id;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al eliminar el usuario",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
const usersSlice = createSlice({
  name: "users",
  initialState: { 
    users: [], 
    selectedUser: null,
    loading: false, 
    error: null 
  },
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load users
      .addCase(loadUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // En caso de error, limpiar la lista para evitar datos desactualizados
        state.users = [];
      })
      
      // Get user by ID
      .addCase(getUserById.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedUser = action.payload;
        }
      })
      
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user.id_user === parseInt(action.payload.id)
        );
        if (index !== -1) {
          state.users[index] = {
            ...state.users[index],
            ...action.payload
          };
        }
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (user) => user.id_user !== parseInt(action.payload)
        );
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUsers, clearSelectedUser, setSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;