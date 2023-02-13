import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Toast} from 'native-base';

export const createUserDataSlice = createSlice({
  name: 'BookmarkManagement',
  initialState: {
    userBookMarks: [],
  },
  reducers: {
    setBookmarks: (state, action) => {
      state.userBookMarks = action.payload;
      console.log('state.userBookMarks is being called');
    },
    userAddBookMarks: (state, action) => {
      state.userBookMarks = [...state.userBookMarks, action.payload];
      AsyncStorage.setItem(
        'userBookMarks',
        JSON.stringify(state.userBookMarks),
      );
      Toast.show({
        title: 'Bookmarked',
        status: 'success',
        placement: 'bottom',
        backgroundColor: '#00b300',
      });
    },
    userRemoveBookMarks: (state, action) => {
      state.userBookMarks = state.userBookMarks.filter(
        item => item.notesId !== action.payload.notesId,
      );
      AsyncStorage.setItem(
        'userBookMarks',
        JSON.stringify(state.userBookMarks),
      );
      Toast.show({
        title: 'Removed from Bookmarks',
        status: 'success',
        placement: 'bottom',
        backgroundColor: '#FF0101',
        duration: 1000,
      });
    },
  },
});

export const {userAddBookMarks, userRemoveBookMarks, setBookmarks} =
  createUserDataSlice.actions;

export default createUserDataSlice.reducer;
