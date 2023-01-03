import { configureStore } from "@reduxjs/toolkit";

import usersDataReducer from "./reducers/usersData";

export default configureStore({
    reducer: {
        usersData: usersDataReducer,
    },
});
