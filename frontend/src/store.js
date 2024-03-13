import { configureStore } from "@reduxjs/toolkit";
import academicYearReducer from "./features/academicYear/academicYearSlice";
import batchReducer from "./features/batch/batchSlice";
import studentReducer from "./features/student/studentSlice";
import clubReducer from "./features/club/clubSlice";

export const store = configureStore({
    reducer: {
        academicYear: academicYearReducer,
        batch: batchReducer,
        student: studentReducer,
        club: clubReducer
    },
});
