import { combineReducers, configureStore } from '@reduxjs/toolkit';

import AllyBotSlice from '../screens/AllyBot/AllyBotSlice';
import BootSlice from '../screens/Boot/BootSlice';
import pdfViewerSlice from '../screens/PdfViewer/pdfViewerSlice';
import SeekHubSlice from '../screens/SeekHub/SeekHubSlice';
import UserRequests from '../screens/UserRequests/UserRequestsSlice';
import SubjectsList from './reducers/subjectsList';
import theme from './reducers/theme';
import userBookmarkManagementReducer from './reducers/userBookmarkManagement';
import usersDataReducer from './reducers/usersData';
import userRecentViewsManagementReducer from './reducers/usersRecentPdfsManager';
import userState from './reducers/userState';

const appReducer = combineReducers({
  bootReducer: BootSlice,
  usersData: usersDataReducer,
  userBookmarkManagement: userBookmarkManagementReducer,
  userRecentPdfs: userRecentViewsManagementReducer,
  subjectsList: SubjectsList,
  userState: userState,
  theme: theme,
  UserRequestsReducer: UserRequests,
  pdfViewerReducer: pdfViewerSlice,
  AllyBotReducer: AllyBotSlice,
  SeekHubReducer: SeekHubSlice
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
