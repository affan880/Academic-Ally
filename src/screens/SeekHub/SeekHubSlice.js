import { createSlice } from "@reduxjs/toolkit";

const SeekHubSlice = createSlice({
    name: 'SeekHub',
    initialState: {
        resourceRequestList : [],
    },
    reducers: {
        setResourceRequestList: (state, action) => {
            state.resourceRequestList = action.payload;
        },
    },
});
export const { setResourceRequestList } = SeekHubSlice.actions;

export default SeekHubSlice.reducer;
