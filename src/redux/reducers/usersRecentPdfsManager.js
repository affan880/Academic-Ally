import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createUserDataSlice = createSlice({
  name: 'RecentsManagement',
  initialState: {
    RecentViews: [],
  },
  reducers: {
    userAddToRecentsStart: (state, action) => {
      //dont add object if it already exists with the notesId
      if (
        state.RecentViews.filter(
          recents => recents.notesId === action.payload.notesId,
        ).length === 0
      ) {
        state.RecentViews.unshift(action.payload);
        AsyncStorage.setItem(
          'RecentsManagement',
          JSON.stringify(state.RecentViews),
        );
      }
      //if it is present then remove it and add it to the top of the array
      else {
        state.RecentViews = state.RecentViews.filter(
          recents => recents.notesId !== action.payload.notesId,
        );
        state.RecentViews.unshift(action.payload);
        AsyncStorage.setItem(
          'RecentsManagement',
          JSON.stringify(state.RecentViews),
        );
      }
    },

    userAddToRecents: (state, action) => {
      state.RecentViews = action.payload;
    },
    userRemoveFromRecents: (state, action) => {
      //renmove the bookmark from the array
      state.RecentViews = state.RecentViews.filter(
        recents => recents.notesId !== action.payload.notesId,
      );
      AsyncStorage.setItem(
        'RecentsManagement',
        JSON.stringify(state.RecentViews),
      );
    },
    userClearRecents: (state, action) => {
      state.RecentViews = [];
      AsyncStorage.setItem(
        'RecentsManagement',
        JSON.stringify(state.RecentViews),
      );
    },
  },
});

export const {
  userAddToRecentsStart,
  userAddToRecents,
  userRemoveFromRecents,
  userClearRecents,
} = createUserDataSlice.actions;

export default createUserDataSlice.reducer;
