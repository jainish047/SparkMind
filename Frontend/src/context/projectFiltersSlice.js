import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProjects } from "../API/projects";
import { setLoadingState } from "./loadingSlice";

const initialState = {
  projects: [],
  filters: {
    q: "",
    status: "",
    budget: "0-0",
    skills: "",
    projectLocation: "",
    clientCountries: "",
    languages: "",
    sortBy: "",
    page: 0,
  },
  totalPages: 0,
};

export const filterProjects = createAsyncThunk(
  "filter/projects",
  async (_, { getState, rejectWithValue }) => {
    try {
      const projectFilters = getState().projectFilter;
      const response = await fetchProjects(projectFilters.filters);
      return response.data;
    } catch (err) {
      console.log("error in project slice->", err);
      return rejectWithValue({
        message: err.response?.data?.message || "Project fetching failed",
        status: err.response?.status || 500,
      });
    }
  }
);

export const projectFilterSlice = createSlice({
  name: "projectFilter",
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      Object.assign(state.filters, action.payload);
      // Merge new filters with existing state
      // filterProjects();
      console.log("filters->", state.status);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(filterProjects.pending, (state) => {
        setLoadingState({ actionName: "projects", isLoading: true });
      })
      .addCase(filterProjects.fulfilled, (state, action) => {
        setLoadingState({ actionName: "projects", isLoading: false });
        state.projects = action.payload.projects;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(filterProjects.rejected, (state, action) => {
        setLoadingState({ actionName: "projects", isLoading: false });
        console.error("Project fetch failed:", action.payload);
      });
  },
});

export const { updateFilters } = projectFilterSlice.actions;

export default projectFilterSlice.reducer;
