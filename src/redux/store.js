import { combineReducers, configureStore } from '@reduxjs/toolkit';

import SubjectsList from './reducers/subjectsList';
import theme from './reducers/theme';
import userBookmarkManagementReducer from './reducers/userBookmarkManagement';
import usersDataReducer from './reducers/usersData';
import userRecentViewsManagementReducer from './reducers/usersRecentPdfsManager';
import userState from './reducers/userState';

const appReducer = combineReducers({
  usersData: usersDataReducer,
  userBookmarkManagement: userBookmarkManagementReducer,
  userRecentPdfs: userRecentViewsManagementReducer,
  subjectsList: SubjectsList,
  userState: userState,
  theme: theme,
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});


// export default configureStore({
//   reducer: {
//     usersData: usersDataReducer,
//     userBookmarkManagement: userBookmarkManagementReducer,
//     userRecentPdfs: userRecentViewsManagementReducer,
//     subjectsList: SubjectsList,
//     userState: userState,
//     theme: theme,
//   },
// });
