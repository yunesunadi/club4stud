import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    schedules: [],
    joinedSchedules: [],
    attendance: [],
    attendanceByMember: [],
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

export const getJoined = createAsyncThunk(
    "schedule/getJoined",
    async () => {
        const res = await fetch(`${api}/api/schedules/joined`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data[0].schedules.filter(schedule => (Object.keys(schedule).length !== 0));
    }
);

export const getAttendance = createAsyncThunk(
    "schedule/getAttendance",
    async () => {
        const url = window.location.href;
        const url_parts = url.split("/");
        const id = url_parts[url_parts.length - 1];
        const res = await fetch(`${api}/api/schedules/attendance/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();
        const attendance = data[0].schedules[0].attendance;

        return { _id: id, attendance };
    }
);

export const getAttendanceByMember = createAsyncThunk(
    "schedule/getAttendanceByMember",
    async () => {
        const res = await fetch(`${api}/api/schedules/attendance/members`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data[0].schedules;
    }
);

const scheduleSlice = createSlice({
    name: "schedule",
    initialState,
    reducers: {
        add: (state, action) => {
            (async () => {
                const { description, start_date_time, end_date_time, location } = action.payload;
                await fetch(`${api}/api/schedules`, {
                    method: "PUT",
                    body: JSON.stringify({ description, start_date_time, end_date_time, location }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            })();
        },
        update: (state, action) => {
            (async () => {
                const { _id, description, start_date_time, end_date_time, location } = action.payload;
                await fetch(`${api}/api/schedules/update/${_id}`, {
                    method: "PUT",
                    body: JSON.stringify({ _id, description, start_date_time, end_date_time, location }),
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
            state.schedules = state.schedules.filter(schedule => schedule._id !== _id);
        },
        present: (state, action) => {
            const { schedule_id, student_id } = action.payload;
            (async () => {
                await fetch(`${api}/api/schedules/attendance/${schedule_id}/present/${student_id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            })();
            state.attendance = {
                _id: state.attendance._id, attendance: state.attendance.attendance?.map(att => {
                    if (att.student._id === student_id) {
                        att.present = true;
                        att.absent = false;
                    }
                    return att;
                })
            };
        },
        absent: (state, action) => {
            const { schedule_id, student_id } = action.payload;
            (async () => {
                await fetch(`${api}/api/schedules/attendance/${schedule_id}/absent/${student_id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            })();
            state.attendance = {
                _id: state.attendance._id, attendance: state.attendance.attendance?.map(att => {
                    if (att.student._id === student_id) {
                        att.absent = true;
                        att.present = false;
                    }
                    return att;
                })
            };
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
            .addCase(getJoined.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getJoined.fulfilled, (state, action) => {
                state.isLoading = false;
                state.joinedSchedules = action.payload;
            })
            .addCase(getJoined.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(getAttendance.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.attendance = action.payload;
            })
            .addCase(getAttendance.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(getAttendanceByMember.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAttendanceByMember.fulfilled, (state, action) => {
                state.isLoading = false;
                state.attendanceByMember = action.payload;
            })
            .addCase(getAttendanceByMember.rejected, (state, action) => {
                state.isLoading = false;
            });
    },
});

export const { add, update, remove, present, absent } = scheduleSlice.actions;

export default scheduleSlice.reducer;