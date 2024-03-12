import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    batches: [],
};

const api = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

export const getAll = createAsyncThunk(
    "batch/getAll",
    async () => {
        const res = await fetch(`${api}/api/batches`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data;
    }
);

const batchSlice = createSlice({
    name: "batch",
    initialState,
    reducers: {
        add: (state, action) => {
            (async () => {
                const { name, founded_date, default_password, academic_year } = action.payload;
                await fetch(`${api}/api/batches`, {
                    method: "POST",
                    body: JSON.stringify({ name, founded_date, default_password, academic_year }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            })();
            state.batches = state.batches;
        },
        update: (state, action) => {
            const { _id, name, founded_date, default_password, academic_year } = action.payload;
            (async () => {
                await fetch(`${api}/api/batches/${_id}`, {
                    method: "PUT",
                    body: JSON.stringify({ name, founded_date, default_password, academic_year }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            })();
            state.batches = state.batches.map(batch => {
                if (batch._id === _id) {
                    batch.name = name;
                    batch.founded_date = founded_date;
                    batch.default_password = default_password;
                    batch.academic_year = academic_year;
                }
                return batch;
            })
        },
        remove: (state, action) => {
            (async () => {
                await fetch(`${api}/api/batches/${action.payload}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            })();
            state.batches = state.batches.filter(batch => batch._id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAll.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAll.fulfilled, (state, action) => {
                state.isLoading = false;
                state.batches = action.payload;
            })
            .addCase(getAll.rejected, (state, action) => {
                state.isLoading = false;
            });
    },
});

export const { add, update, remove } = batchSlice.actions;

export default batchSlice.reducer;
