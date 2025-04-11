import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loadingStates: {
    // Define loading states for each action
    login: false,
    signup: false,
    fetchUserInfo: false,
    resendEmail:false,
    resetPW: false,
    projects: false,
    skills: false
  }
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoadingState: (state, action) => {
      const { actionName, isLoading } = action.payload;
      state.loadingStates[actionName] = isLoading;
    },
  }
});

export const { setLoadingState } = loadingSlice.actions;
export default loadingSlice.reducer;