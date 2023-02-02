import { configureStore } from "@reduxjs/toolkit";

import usersDataReducer from "./reducers/usersData";
import userBookmarkManagementReducer from "./reducers/userBookmarkManagement";

export default configureStore({
    reducer: {
        usersData: usersDataReducer,
        userBookmarkManagement: userBookmarkManagementReducer,
    },
});
