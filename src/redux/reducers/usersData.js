import {createSlice} from '@reduxjs/toolkit';

export const createUserDataSlice = createSlice({
  name: 'usersData',
  initialState: {
    usersData: [],
    validEmail: false,
  },
  reducers: {
    setUsersData: (state, action) => {
      state.usersData = action.payload;
    },
    setValidEmail: (state, action) => {
      console.log('action.payload', action.payload);
      state.validEmail = action.payload;
    },
  },
});

export const {setUsersData, setValidEmail} = createUserDataSlice.actions;

export default createUserDataSlice.reducer;
