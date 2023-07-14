import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';

export const createUserDataSlice = createSlice({
  name: 'RecentsManagement',
  initialState: {
    RecentViews: [],
    RecentPdfChats: [],
  },
  reducers: {
    userAddToRecentsStart: (state, action) => {
      if (state.RecentViews?.length > 0) {
        state.RecentViews = [action.payload, ...state.RecentViews];

        state.RecentViews = state.RecentViews.filter(
          (recents, index, self) =>
            index === self.findIndex(t => t.did === recents.did),
        );

        AsyncStorage.setItem(
          'RecentsManagement',
          JSON.stringify(state.RecentViews),
        );
      } else {
        state.RecentViews = [action.payload];
      }
    },

    userAddToRecents: (state, action) => {
      state.RecentViews = action.payload;
    },
    userRemoveFromRecents: (state, action) => {
      state.RecentViews = state.RecentViews.filter(
        recents => recents.did !== action.payload.did,
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

    updateRecentChats: (state, action) => {
      if (state.RecentPdfChats?.length > 0) {
        state.RecentPdfChats = action.payload 
      }
    },
  },
});

export const {
  userAddToRecentsStart,
  userAddToRecents,
  userRemoveFromRecents,
  userClearRecents,
  updateRecentChats
} = createUserDataSlice.actions;

export default createUserDataSlice.reducer;
