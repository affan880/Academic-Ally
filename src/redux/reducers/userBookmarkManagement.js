import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createUserDataSlice = createSlice({
    name: "BookmarkManagement",
    initialState: {
        userBookMarks: [],
    },
    reducers: {
        userAddBookMarks: (state, action) => {
            state.userBookMarks = [...state.userBookMarks, action.payload];
            AsyncStorage.setItem("userBookMarks", JSON.stringify(state.userBookMarks));
        },
        userRemoveBookMarks: (state, action) => {
            //renmove the bookmark from the array
            state.userBookMarks = state.userBookMarks.filter(
                (bookmark) => bookmark.notesId !== action.payload.notesId
            );
            AsyncStorage.setItem("userBookMarks", JSON.stringify(state.userBookMarks));
        },
    }
});

export const { userAddBookMarks, userRemoveBookMarks  } = createUserDataSlice.actions;

export default createUserDataSlice.reducer;