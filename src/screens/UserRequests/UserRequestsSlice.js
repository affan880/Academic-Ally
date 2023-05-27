import { createSlice } from '@reduxjs/toolkit';

const UserRequests = createSlice({
    name: 'UserRequests',
    initialState: {
        NewRequests: [],
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
        }
    },
});
export const { setNewRequests, setRequestNull } = UserRequests.actions;

export default UserRequests.reducer;
