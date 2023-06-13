import { createSlice } from '@reduxjs/toolkit';

const UserRequests = createSlice({
    name: 'UserRequests',
    initialState: {
        NewRequests: [],
        loadingRequests: false,
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
    },
});
export const { setNewRequests, setRequestNull, setLoading } = UserRequests.actions;

export default UserRequests.reducer;
