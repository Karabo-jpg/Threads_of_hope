import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  language: localStorage.getItem('language') || 'en',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setLanguage } = uiSlice.actions;
export default uiSlice.reducer;


