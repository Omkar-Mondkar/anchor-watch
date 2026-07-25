import { configureStore } from '@reduxjs/toolkit'

// Store will be populated with slices in subsequent changes
// Placeholder to satisfy Provider requirement
export const store = configureStore({
  reducer: {
    // slices added in Change 2+ (auth, servers, baselines, drift, alerts, audit)
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
