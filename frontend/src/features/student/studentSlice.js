import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    students: [],
    batchStudents: [],
};

const api = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

export const getAll = createAsyncThunk(
    "student/getAll",
    async () => {
        const res = await fetch(`${api}/api/students`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data;
    }
);

export const getBatchAll = createAsyncThunk(
    "student/getBatchAll",
    async () => {
        const url = window.location.href;
        const url_parts = url.split("/");
        const id = url_parts[url_parts.length - 1];
        const res = await fetch(`${api}/api/batches/students/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data;
    }
);

const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        add: (state, action) => {
            (async () => {
                const { student_id, name, email, phone_number, gender, date_of_birth, password, batch } = action.payload;
                await fetch(`${api}/api/students`, {
                    method: "POST",
                    body: JSON.stringify({ student_id, name, email, phone_number, gender, date_of_birth, password, batch, role: "student" }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            })();
            state.students = state.students;
            state.batchStudents = state.batchStudents;
        },
        update: (state, action) => {
            const { _id, student_id, name, email, phone_number, gender, date_of_birth, password, batch } = action.payload;
            (async () => {
                await fetch(`${api}/api/students/${_id}`, {
                    method: "PUT",
                    body: JSON.stringify({ student_id, name, email, phone_number, gender, date_of_birth, password, batch }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            })();
            state.students = state.students.map(student => {
                if (student._id === _id) {
                    student.student_id = student_id;
                    student.name = name;
                    student.email = email;
                    student.phone_number = phone_number;
                    student.gender = gender;
                    student.date_of_birth = date_of_birth;
                    student.password = password;
                    student.batch = batch;
                }
                return student;
            });
            state.batchStudents = state.batchStudents.map(student => {
                if (student._id === _id) {
                    student.student_id = student_id;
                    student.name = name;
                    student.email = email;
                    student.phone_number = phone_number;
                    student.gender = gender;
                    student.date_of_birth = date_of_birth;
                    student.password = password;
                    student.batch = batch;
                }
                return student;
            });
        },
        remove: (state, action) => {
            (async () => {
                await fetch(`${api}/api/students/${action.payload}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            })();
            state.students = state.students.filter(student => student._id !== action.payload);
            state.batchStudents = state.batchStudents.filter(student => student._id !== action.payload);
        },
        updatePassword: (state, action) => {
            const { old_password, new_password } = action.payload;
            (async () => {
                await fetch(`${api}/api/students/update/password`, {
                    method: "PUT",
                    body: JSON.stringify({ old_password, new_password }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            })();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAll.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAll.fulfilled, (state, action) => {
                state.isLoading = false;
                state.students = action.payload;
            })
            .addCase(getAll.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(getBatchAll.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBatchAll.fulfilled, (state, action) => {
                state.isLoading = false;
                state.batchStudents = action.payload;
            })
            .addCase(getBatchAll.rejected, (state, action) => {
                state.isLoading = false;
            });
    },
});

export const { add, update, remove, updatePassword } = studentSlice.actions;

export default studentSlice.reducer;
