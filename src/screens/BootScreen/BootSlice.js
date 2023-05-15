import { createSlice } from '@reduxjs/toolkit';

const BootSlice = createSlice({
    name: 'boot',
    initialState: {
        appBooting: true,
        authToken: null,
        showIntro: true,
        company: null
    },
    reducers: {
        setAppBooting: (state, action) => {
            state.appBooting = action.payload;
        },
        setShowIntro: (state, action) => {
            state.showIntro = action.payload;
        },
        setCompany: (state, action) => {
            state.company = action.payload;
        },
    },
});
export const { setAppBooting, setAuthToken, setShowIntro, setCompany } = BootSlice.actions;

export default BootSlice.reducer;
