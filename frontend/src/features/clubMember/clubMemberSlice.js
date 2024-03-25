import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    requestedClubs: [],
    joinedClubs: [],
    clubMembers: [],
    joinedMembers: [],
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

export const getJoined = createAsyncThunk(
    "clubMember/getJoined",
    async () => {
        const res = await fetch(`${api}/api/club_members/clubs/joined`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data;
    }
);

export const getClubMembers = createAsyncThunk(
    "clubMember/getClubMembers",
    async () => {
        const res = await fetch(`${api}/api/clubs/members`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data[0].members.filter(({ request, approve }) => request && approve);
    }
);

export const getJoinedMembers = createAsyncThunk(
    "clubMember/getJoinedMembers",
    async () => {
        const res = await fetch(`${api}/api/clubs/members`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data[0].members.filter(({ request, approve }) => request && !approve);
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
            .addCase(getJoined.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getJoined.fulfilled, (state, action) => {
                state.isLoading = false;
                state.joinedClubs = action.payload;
            })
            .addCase(getJoined.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(getClubMembers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getClubMembers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clubMembers = action.payload;
            })
            .addCase(getClubMembers.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(getJoinedMembers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getJoinedMembers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.joinedMembers = action.payload;
            })
            .addCase(getJoinedMembers.rejected, (state, action) => {
                state.isLoading = false;
            });
    },
});
export const { join, cancel, approve } = clubMemberSlice.actions;

export default clubMemberSlice.reducer;