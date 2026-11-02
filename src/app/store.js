import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from '@/features/workspace/workspaceSlice';
import themeReducer from '@/features/theme/themeSlice';

export const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    theme: themeReducer,
  },
});
