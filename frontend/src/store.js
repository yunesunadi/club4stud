import { configureStore } from "@reduxjs/toolkit";
import academicYearReducer from "./features/academicYear/academicYearSlice";
import batchReducer from "./features/batch/batchSlice";
import studentReducer from "./features/student/studentSlice";

export const store = configureStore({
    reducer: {
        academicYear: academicYearReducer,
        batch: batchReducer,
        student: studentReducer,
    },
});
