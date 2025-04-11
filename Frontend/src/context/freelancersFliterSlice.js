import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setLoadingState } from "./loadingSlice";
import { fetchFreelancers } from "../API/freelancers";

const initialState = {
  freelancers: [],
  filters: {
    q: "",
    skills: "",
    rating:"",
    locations:"",
    country: "",
    languages: "",
    sortBy: "",
    page: 0,
  },
  totalPages: 0,
};

export const filterFreelancers = createAsyncThunk(
  "filter/freelancers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const freelancersFilters = getState().freelancerFilters;
      console.log("filters in api call:", freelancersFilters.filters);
      const response = await fetchFreelancers(freelancersFilters.filters);
      return response.data;
    } catch (err) {
      console.log("error in freelancers slice->", err);
      return rejectWithValue({
        message: err.response?.data?.message || "Freelancers fetching failed",
        status: err.response?.status || 500,
      });
    }
  }
);

export const freelancersFilterSlice = createSlice({
  name: "freelancerFilters",
  initialState,
  reducers: {
    updateFreelancersFilters: (state, action) => {
      Object.assign(state.filters, action.payload);
      // Merge new filters with existing state
      // filterProjects();
      console.log("filters in slice->", state.filters);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(filterFreelancers.pending, (state) => {
        setLoadingState({ actionName: "freelancers", isLoading: true });
      })
      .addCase(filterFreelancers.fulfilled, (state, action) => {
        setLoadingState({ actionName: "freelancers", isLoading: false });
        state.freelancers = action.payload.freelancers;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(filterFreelancers.rejected, (state, action) => {
        setLoadingState({ actionName: "freelancers", isLoading: false });
        console.error("Project fetch failed:", action.payload);
      });
  },
});

export const { updateFreelancersFilters } = freelancersFilterSlice.actions;

export default freelancersFilterSlice.reducer;
