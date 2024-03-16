import { createSlice } from "@reduxjs/toolkit";

const api = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

const schoolAdminSlice = createSlice({
    name: "schoolAdmin",
    initialState: {},
    reducers: {
        changeEmail: (state, action) => {
            const { email } = action.payload;
            (async () => {
                await fetch(`${api}/api/school_admins/change/email`, {
                    method: "PUT",
                    body: JSON.stringify({ email }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            })();
        },
        changePassword: (state, action) => {
            const { old_password, new_password } = action.payload;
            (async () => {
                await fetch(`${api}/api/school_admins/change/password`, {
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
});

export const { changeEmail, changePassword } = schoolAdminSlice.actions;

export default schoolAdminSlice.reducer;