import { configureStore } from "@reduxjs/toolkit";
import academicYearReducer from "./features/academicYear/academicYearSlice";
import batchReducer from "./features/batch/batchSlice";

export const store = configureStore({
    reducer: {
        academicYear: academicYearReducer,
        batch: batchReducer,
    },
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: false,
    //         immutableCheck: false,
    //     }),
});
