import {createSlice} from '@reduxjs/toolkit';

export const createUserDataSlice = createSlice({
  name: 'usersData',
  initialState: {
    usersData: [],
    validEmail: false,
    usersDataLoaded: false,
  },
  reducers: {
    setUsersData: (state, action) => {
      state.usersData = action.payload;
    },
    setValidEmail: (state, action) => {
      state.validEmail = action.payload;
    },
    setUsersDataLoaded: (state, action) => {
      state.usersDataLoaded = action.payload;
    },
  },
});

export const {setUsersData, setValidEmail, setUsersDataLoaded} =
  createUserDataSlice.actions;

export default createUserDataSlice.reducer;
