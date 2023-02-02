import { createSlice } from "@reduxjs/toolkit";

export const createUserDataSlice = createSlice({
    name: "BookmarkManagement",
    initialState: {
        userBookMarks: [],
    },
    reducers: {
        userAddBookMarks: (state, action) => {
            state.userBookMarks = [...state.userBookMarks, action.payload];
        },
        userRemoveBookMarks: (state, action) => {
            //renmove the bookmark from the array
            state.userBookMarks = state.userBookMarks.filter(
                (bookmark) => bookmark.notesId !== action.payload.notesId
            );
        },
    }
});

export const { userAddBookMarks, userRemoveBookMarks  } = createUserDataSlice.actions;

export default createUserDataSlice.reducer;