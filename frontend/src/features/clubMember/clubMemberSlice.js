import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    requestedClubs: [],
    members: [],
};
const api = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

export const getRequested = createAsyncThunk(
    "clubMember/getRequested",
    async () => {
        const res = await fetch(`${api}/api/club_members/clubs/requested`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data;
    }
);

export const getMembers = createAsyncThunk(
    "clubMember/getMembers",
    async () => {
        const res = await fetch(`${api}/api/clubs/members`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data;
    }
);

const clubMemberSlice = createSlice({
    name: "clubMember",
    initialState,
    reducers: {
        join: (state, action) => {
            const { _id, student } = action.payload;
            (async () => {
                await fetch(`${api}/api/clubs/members/${_id}/join/${student}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            })();
        },
        cancel: (state, action) => {
            const { _id, student } = action.payload;
            (async () => {
                await fetch(`${api}/api/clubs/members/${_id}/cancel/${student}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            })();
            state.requestedClubs = state.requestedClubs.filter(club => club._id !== _id);
        },
        approve: (state, action) => {
            (async () => {
                await fetch(`${api}/api/clubs/members/approve/${action.payload}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            })();
            // state.requestedClubs = state.requestedClubs.filter(club => club._id !== _id);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRequested.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getRequested.fulfilled, (state, action) => {
                state.isLoading = false;
                state.requestedClubs = action.payload;
            })
            .addCase(getRequested.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(getMembers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMembers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.members = action.payload;
            })
            .addCase(getMembers.rejected, (state, action) => {
                state.isLoading = false;
            });
    },
});
export const { join, cancel, approve } = clubMemberSlice.actions;

export default clubMemberSlice.reducer;