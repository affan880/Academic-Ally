import { createSlice } from '@reduxjs/toolkit';

const BootSlice = createSlice({
    name: 'boot',
    initialState: {
        appBooting: true,
        authToken: null,
        showIntro: true,
        customClaims: null,
        protectedUtils: null,
        utilis: null,
        currentVersion: null,
        requiredVersion: null,
        userInfo: null
    },
    reducers: {
        setAppBooting: (state, action) => {
            state.appBooting = action.payload;
        },
        setShowIntro: (state, action) => {
            state.showIntro = action.payload;
        },
        setCustomClaims: (state, action) => {
            state.customClaims = action.payload;
        },
        setProtectedUtils: (state, action) => {
            state.protectedUtils = action.payload;
        },
        setUtilis: (state, action) => {
            state.utilis = action.payload;
        },
        setCurrentVersion: (state, action) => {
            state.currentVersion = action.payload;
        },
        setRequiredVersion: (state, action) => {
            state.requiredVersion = action.payload;
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload
        }
    },
});
export const { setAppBooting, setAuthToken, setShowIntro, setCustomClaims, setProtectedUtils, setUtilis, setRequiredVersion, setCurrentVersion, setUserInfo } = BootSlice.actions;

export default BootSlice.reducer;
