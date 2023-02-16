import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createUserDataSlice = createSlice({
  name: 'SubjectsList',
  initialState: {
    list: [],
    listLoaded: false,
  },
  reducers: {
    setSubjectsList: (state, action) => {
      state.list = action.payload;
      AsyncStorage.setItem('subjectsList', JSON.stringify(state.list));
    },
    setListLoaded: (state, action) => {
      state.listLoaded = action.payload;
    },
  },
});

export const {setSubjectsList, setListLoaded} = createUserDataSlice.actions;

export default createUserDataSlice.reducer;
