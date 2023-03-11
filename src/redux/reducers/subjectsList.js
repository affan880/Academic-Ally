import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createUserDataSlice = createSlice({
  name: 'SubjectsList',
  initialState: {
    list: [],
    listLoaded: false,
    reccommendSubjects: [],
    reccommendSubjectsLoaded: false,
    visitedSubjects: {
      Notes: {},
      QuestionPapers: {},
      OtherResources: {},
      Syllabus: {},
    },
    versionKeys: {
      Notes: '',
      QuestionPapers: '',
      OtherResources: '',
      Syllabus: '',
    },
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
    setVisitedSubjects: (state, action) => {
      const arraysOfArrays = [].concat(...action.payload.subject);
      state.visitedSubjects[action.payload.status][action.payload.subjectName] = arraysOfArrays;
      state.versionKeys[action.payload.status][action.payload.subjectName] = action.payload.versionKey;
      AsyncStorage.setItem(
        'visitedSubjects',
        JSON.stringify(state.visitedSubjects),
      );
      AsyncStorage.setItem(
        'versionKeys',
        JSON.stringify(state.versionKeys),
      );
    },
    getVisitedSubjects: (state, action) => {
      AsyncStorage.getItem('visitedSubjects').then((value) => {
        if (value !== null) {
          state.visitedSubjects = JSON.parse(value);
        }
      });
    },
  },
});

export const {
  setSubjectsList,
  setListLoaded,
  setReccommendSubjects,
  setReccommendSubjectsLoaded,
  setVisitedSubjects
} = createUserDataSlice.actions;

export default createUserDataSlice.reducer;
