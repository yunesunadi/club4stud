import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    schedules: [],
};

const api = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

export const getAll = createAsyncThunk(
    "schedule/getAll",
    async () => {
        const res = await fetch(`${api}/api/schedules`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data[0].schedules.filter(schedule => (Object.keys(schedule).length !== 0));
    }
);

const scheduleSlice = createSlice({
    name: "schedule",
    initialState,
    reducers: {
        add: (state, action) => {
            (async () => {
                const { description, date, start_time, end_time, location } = action.payload;
                await fetch(`${api}/api/schedules`, {
                    method: "PUT",
                    body: JSON.stringify({ description, date, start_time, end_time, location }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            })();
        },
        update: (state, action) => {
            (async () => {
                const { _id, description, date, start_time, end_time, location } = action.payload;
                await fetch(`${api}/api/schedules/update/${_id}`, {
                    method: "PUT",
                    body: JSON.stringify({ _id, description, date, start_time, end_time, location }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            })();
        },
        remove: (state, action) => {
            const _id = action.payload;
            (async () => {
                await fetch(`${api}/api/schedules/remove/${_id}`, {
                    method: "PUT",
                    body: JSON.stringify({ _id }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            })();
            state.schedules = state.schedules.map(schedule => {
                if (schedule._id === _id) {
                    schedule = {};
                }
                return schedule;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAll.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAll.fulfilled, (state, action) => {
                state.isLoading = false;
                state.schedules = action.payload;
            })
            .addCase(getAll.rejected, (state, action) => {
                state.isLoading = false;
            })
    },
});

export const { add, update, remove } = scheduleSlice.actions;

export default scheduleSlice.reducer;