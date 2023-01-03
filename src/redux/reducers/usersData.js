import { createSlice } from "@reduxjs/toolkit";

export const createUserDataSlice = createSlice({
    name: "usersData",
    initialState: {
        usersData: [],
    },
    reducers: {
        setUsersData: (state, action) => {
            state.usersData = action.payload;
        }
    }
});

export const { setUsersData } = createUserDataSlice.actions;

export default createUserDataSlice.reducer;