import { configureStore } from "@reduxjs/toolkit";
import academicYearReducer from "./features/academicYear/academicYearSlice";

export const store = configureStore({
    reducer: {
        academicYear: academicYearReducer,
    },
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: false,
    //         immutableCheck: false,
    //     }),
});
