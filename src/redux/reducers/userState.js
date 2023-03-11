import { createSlice } from '@reduxjs/toolkit';

export const createUserDataSlice = createSlice({
    name: 'usersData',
    initialState: {
        userState: false,
        customLoader: false,
        noConnection: false,
        resourceLoader: false,
    },
    reducers: {
        setUserState: (state, action) => {
            state.userState = action.payload;
        },
        setCustomLoader: (state, action) => {
            state.customLoader = action.payload;
        },
        setNoConnection: (state, action) => {
            state.noConnection = action.payload;
        },
        setResourceLoader: (state, action) => {
            state.resourceLoader = action.payload;
        }
    },
});

export const { setUserState, setCustomLoader, setNoConnection, setResourceLoader } =
    createUserDataSlice.actions;

export default createUserDataSlice.reducer;
