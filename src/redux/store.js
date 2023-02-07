import { configureStore } from "@reduxjs/toolkit";

import usersDataReducer from "./reducers/usersData";
import userBookmarkManagementReducer from "./reducers/userBookmarkManagement";
import userRecentViewsManagementReducer from "./reducers/usersRecentPdfsManager";

export default configureStore({
    reducer: {
        usersData: usersDataReducer,
        userBookmarkManagement: userBookmarkManagementReducer,
        userRecentPdfs: userRecentViewsManagementReducer,
    },
});
