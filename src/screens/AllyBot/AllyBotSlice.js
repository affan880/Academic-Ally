import { createSlice } from '@reduxjs/toolkit';

const AllyBotSlice = createSlice({
    name: 'AllyBot',
    initialState: {
        initiatedChatsList : [],
    },
    reducers: {
        setInitiatedChatList: (state, action) => {
            state.initiatedChatsList = action.payload;
        },
    },
});
export const { setInitiatedChatList } = AllyBotSlice.actions;

export default AllyBotSlice.reducer;
