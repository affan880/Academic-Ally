import { createSlice } from '@reduxjs/toolkit';

const UserRequests = createSlice({
    name: 'UserRequests',
    initialState: {
        NewRequests: [],
        loadingRequests: false,
        SeekHubRequests: []
    },
    reducers: {
        setNewRequests: (state, action) => {
            if (state.NewRequests.length === 0) {
                state.NewRequests = action.payload;
            }
            else {
                state.NewRequests = [...state.NewRequests, ...action.payload];
            }
        },
        setRequestNull: (state) => {
            state.NewRequests = [];
        },
        setLoading: (state, action) => {
            state.loadingRequests = action.payload;
        },
        setNewSeekHubRequests: (state, action) => {
            if (state.SeekHubRequests.length === 0) {
                state.SeekHubRequests = action.payload;
            }
            else {
                state.SeekHubRequests = [...state.SeekHubRequests, ...action.payload];
            }
        },
        setNewSeekHubRequestNull: (state) => {
            state.SeekHubRequests = [];
        },
    },
});
export const { setNewRequests, setRequestNull, setLoading, setNewSeekHubRequests, setNewSeekHubRequestNull } = UserRequests.actions;

export default UserRequests.reducer;
