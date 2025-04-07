import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Get all posts
export const getPosts = createAsyncThunk(
  "posts/getPosts",
  async (_, thunkAPI) => {
    try {
      // Get user-created posts from localStorage
      const userPosts = JSON.parse(localStorage.getItem("userPosts") || "[]");
      return userPosts;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "An error occurred"
      );
    }
  }
);

// Get single post
export const getPostBySlug = createAsyncThunk(
  "posts/getPostBySlug",
  async (slug, thunkAPI) => {
    try {
      // Check user-created posts
      const userPosts = JSON.parse(localStorage.getItem("userPosts") || "[]");
      const post = userPosts.find((post) => post.slug === slug);

      if (!post) {
        throw new Error("Post not found");
      }

      return post;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "An error occurred");
    }
  }
);

// Create post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, thunkAPI) => {
    try {
      // For development, simulate creating a post
      const newPost = {
        _id: Date.now().toString(),
        ...postData,
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage for persistence
      const userPosts = JSON.parse(localStorage.getItem("userPosts") || "[]");
      userPosts.push(newPost);
      localStorage.setItem("userPosts", JSON.stringify(userPosts));

      return newPost;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "An error occurred"
      );
    }
  }
);

// Update post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (postData, thunkAPI) => {
    try {
      // Get existing posts from localStorage
      const userPosts = JSON.parse(localStorage.getItem("userPosts") || "[]");

      // Find the post to update
      const postIndex = userPosts.findIndex(
        (post) => post._id === postData._id
      );

      if (postIndex === -1) {
        throw new Error("Post not found");
      }

      // Update the post
      userPosts[postIndex] = {
        ...userPosts[postIndex],
        ...postData,
        updatedAt: new Date().toISOString(),
      };

      // Save back to localStorage
      localStorage.setItem("userPosts", JSON.stringify(userPosts));

      return postData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "An error occurred");
    }
  }
);

// Delete post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, thunkAPI) => {
    try {
      // Get existing posts from localStorage
      const userPosts = JSON.parse(localStorage.getItem("userPosts") || "[]");

      // Filter out the post to delete
      const updatedPosts = userPosts.filter((post) => post._id !== postId);

      // Save back to localStorage
      localStorage.setItem("userPosts", JSON.stringify(updatedPosts));

      return postId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "An error occurred");
    }
  }
);

// Delete all user posts
export const deleteAllUserPosts = createAsyncThunk(
  "posts/deleteAllUserPosts",
  async (userId, thunkAPI) => {
    try {
      // Get existing posts from localStorage
      const userPosts = JSON.parse(localStorage.getItem("userPosts") || "[]");

      // Filter out posts by this user
      const updatedPosts = userPosts.filter((post) => post.authorId !== userId);

      // Save back to localStorage
      localStorage.setItem("userPosts", JSON.stringify(updatedPosts));

      return userId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "An error occurred");
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    post: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetPostState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all posts
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get post by slug
      .addCase(getPostBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
      })
      .addCase(getPostBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.posts.push(action.payload);
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
        state.loading = false;
        state.success = true;
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
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
        state.loading = false;
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete all user posts
      .addCase(deleteAllUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAllUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(
          (post) => post.authorId !== action.payload
        );
      })
      .addCase(deleteAllUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPostState } = postsSlice.actions;
export default postsSlice.reducer;
