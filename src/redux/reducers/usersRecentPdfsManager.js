import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createUserDataSlice = createSlice({
    name: "RecentsManagement",
    initialState: {
        RecentViews: [],
    },
    reducers: {
        userAddToRecents: (state, action) => {
            const index = state.RecentViews.findIndex(
              (recents) => recents.notesId === action.payload.notesId
            );
          
            if (index === -1) {
              state.RecentViews = [...state.RecentViews, action.payload];
            } else {
              state.RecentViews.splice(index, 1);
              state.RecentViews = [action.payload, ...state.RecentViews];
            }
          
            AsyncStorage.setItem("RecentsManagement", JSON.stringify(state.RecentViews));
          },
        userRemoveFromRecents: (state, action) => {
            //renmove the bookmark from the array
            state.RecentViews = state.RecentViews.filter(
                (recents) => recents.notesId !== action.payload.notesId
            );
            AsyncStorage.setItem("RecentsManagement", JSON.stringify(state.RecentViews));
        },
        userClearRecents: (state, action) => {
            state.RecentViews = [];
            AsyncStorage.setItem("RecentsManagement", JSON.stringify(state.RecentViews));
        }
    }
});

export const { userAddToRecents, userRemoveFromRecents, userClearRecents  } = createUserDataSlice.actions;

export default createUserDataSlice.reducer;