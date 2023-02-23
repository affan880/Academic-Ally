import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createUserDataSlice = createSlice({
  name: 'SubjectsList',
  initialState: {
    list: [],
    listLoaded: false,
    reccommendSubjects: [],
    reccommendSubjectsLoaded: false,
  },
  reducers: {
    setSubjectsList: (state, action) => {
      state.list = action.payload;
      AsyncStorage.setItem('subjectsList', JSON.stringify(state.list));
    },
    setListLoaded: (state, action) => {
      state.listLoaded = action.payload;
    },
    setReccommendSubjects: (state, action) => {
      state.reccommendSubjects = action.payload;
      AsyncStorage.setItem(
        'reccommendSubjects',
        JSON.stringify(state.reccommendSubjects),
      );
    },
    setReccommendSubjectsLoaded: (state, action) => {
      state.reccommendSubjectsLoaded = action.payload;
    },
  },
});

export const {
  setSubjectsList,
  setListLoaded,
  setReccommendSubjects,
  setReccommendSubjectsLoaded,
} = createUserDataSlice.actions;

export default createUserDataSlice.reducer;
