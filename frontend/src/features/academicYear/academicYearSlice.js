import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    academicYears: [],
};

const api = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

export const getAll = createAsyncThunk(
    "academicYear/getAll",
    async () => {
        const res = await fetch(`${api}/api/academic_years`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data;
    }
);

const academicYearSlice = createSlice({
    name: "academicYear",
    initialState,
    reducers: {
        add: (state, action) => {
            (async () => {
                await fetch(`${api}/api/academic_years`, {
                    method: "POST",
                    body: JSON.stringify({ name: action.payload }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            })();
            state.academicYears = state.academicYears;
        },
        update: (state, action) => {
            (async () => {
                await fetch(`${api}/api/academic_years/${action.payload._id}`, {
                    method: "PUT",
                    body: JSON.stringify({ name: action.payload.name }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            })();
            state.academicYears = state.academicYears.map(academicYear => {
                if (academicYear._id === action.payload._id) {
                    academicYear.name = action.payload.name;
                }
                return academicYear;
            });
        },
        remove: (state, action) => {
            (async () => {
                await fetch(`${api}/api/academic_years/${action.payload}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            })();
            state.academicYears = state.academicYears.filter(academicYear => academicYear._id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAll.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAll.fulfilled, (state, action) => {
                state.isLoading = false;
                state.academicYears = action.payload;
            })
            .addCase(getAll.rejected, (state, action) => {
                state.isLoading = false;
            });
    },
});

export const { add, update, remove } = academicYearSlice.actions;

export default academicYearSlice.reducer;
