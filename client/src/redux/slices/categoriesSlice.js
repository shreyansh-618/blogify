import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Mock data for development
const mockCategories = [
  { id: "1", name: "Technology", slug: "technology" },
  { id: "2", name: "Web Development", slug: "web-development" },
  { id: "3", name: "Backend", slug: "backend" },
  { id: "4", name: "Database", slug: "database" },
  { id: "5", name: "Frontend", slug: "frontend" },
  { id: "6", name: "DevOps", slug: "devops" },
];

// Get all categories
export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async (_, thunkAPI) => {
    try {
      // For development, return mock data instead of making an API call
      return mockCategories;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "An error occurred"
      );
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categoriesSlice.reducer;
