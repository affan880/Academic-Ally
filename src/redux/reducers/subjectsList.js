import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createUserDataSlice = createSlice({
  name: 'SubjectsList',
  initialState: {
    list: [],
  },
  reducers: {
    setSubjectsList: (state, action) => {
      state.list = action.payload;
      AsyncStorage.setItem('subjectsList', JSON.stringify(state.list));
    },
  },
});

export const {setSubjectsList} = createUserDataSlice.actions;

export default createUserDataSlice.reducer;
