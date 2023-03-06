import {createSlice} from '@reduxjs/toolkit';

export const createUserDataSlice = createSlice({
  name: 'usersData',
  initialState: {
    usersData: [],
    validEmail: false,
    usersDataLoaded: false,
    userProfile: ""
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
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    }
  },
});

export const {setUsersData, setValidEmail, setUsersDataLoaded, setUserProfile } =
  createUserDataSlice.actions;

export default createUserDataSlice.reducer;
