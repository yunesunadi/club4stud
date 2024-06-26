import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    clubs: [],
    clubProposals: [],
    approvedProposals: [],
    declinedProposals: [],
    authClub: {}
};

const api = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

export const getAll = createAsyncThunk(
    "club/getAll",
    async () => {
        const res = await fetch(`${api}/api/clubs`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data;
    }
);

export const getAuthClub = createAsyncThunk(
    "club/getAuthClub",
    async () => {
        const res = await fetch(`${api}/api/clubs/auth`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data;
    }
);

export const getAllProposals = createAsyncThunk(
    "club/getAllProposals",
    async () => {
        const res = await fetch(`${api}/api/club_proposals`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data;
    }
);

export const getApproved = createAsyncThunk(
    "club/getApproved",
    async () => {
        const res = await fetch(`${api}/api/club_proposals/approved`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data;
    }
);

export const getDeclined = createAsyncThunk(
    "club/getDeclined",
    async () => {
        const res = await fetch(`${api}/api/club_proposals/declined`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { data } = await res.json();

        return data;
    }
);

const clubSlice = createSlice({
    name: "club",
    initialState,
    reducers: {
        add: (state, action) => {
            (async () => {
                const { name, description, purpose, member_fees, founded_date, phone_number, email, password, owner } = action.payload;
                await fetch(`${api}/api/club_proposals`, {
                    method: "POST",
                    body: JSON.stringify({
                        name, description, purpose, member_fees, founded_date, phone_number, email, password, owner, request: true, approve: false, decline: false, role: "club_admin", schedules: [], members: []
                    }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            })();
            state.clubProposals = state.clubProposals;
            state.clubs = state.clubs;
        },
        approve: (state, action) => {
            const _id = action.payload;
            (async () => {
                await fetch(`${api}/api/club_proposals/approve/${_id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            })();
            state.clubProposals = state.clubProposals.map(club => {
                if (club._id === _id) {
                    club.approve = true;
                }
                return club;
            });
            state.clubProposals = state.clubProposals.filter(club => club._id !== action.payload);
            state.clubs = state.clubs.map(club => {
                if (club._id === _id) {
                    club.approve = true;
                }
                return club;
            });
            state.clubs = state.clubs.filter(club => club._id !== action.payload);
        },
        decline: (state, action) => {
            const _id = action.payload;
            (async () => {
                await fetch(`${api}/api/club_proposals/decline/${_id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            })();
            state.clubProposals = state.clubProposals.map(club => {
                if (club._id === _id) {
                    club.decline = true;
                }
                return club;
            });
            state.clubProposals = state.clubProposals.filter(club => club._id !== action.payload);
            state.clubs = state.clubs.map(club => {
                if (club._id === _id) {
                    club.decline = true;
                }
                return club;
            });
            state.clubs = state.clubs.filter(club => club._id !== action.payload);
        },
        update: (state, action) => {
            const { name, description, purpose, member_fees, founded_date, phone_number, email } = action.payload;
            (async () => {
                await fetch(`${api}/api/clubs/update`, {
                    method: "PUT",
                    body: JSON.stringify({ name, description, purpose, member_fees, founded_date, phone_number, email }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            })();
            state.clubs = state.clubs.map(club => {
                if (club._id === _id) {
                    club.name = name;
                    club.description = description;
                    club.purpose = purpose;
                    club.member_fees = member_fees;
                    club.founded_date = founded_date;
                    club.phone_number = phone_number;
                    club.email = email;
                }
                return club;
            });
        },
        remove: (state, action) => {
            (async () => {
                await fetch(`${api}/api/clubs/${action.payload}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            })();
            state.clubs = state.clubs.filter(club => club._id !== action.payload);
        },
        updatePassword: (state, action) => {
            const { old_password, new_password } = action.payload;
            (async () => {
                await fetch(`${api}/api/clubs/update/password`, {
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
                state.clubs = action.payload;
            })
            .addCase(getAll.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(getAllProposals.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllProposals.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clubProposals = action.payload;
            })
            .addCase(getAllProposals.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(getApproved.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getApproved.fulfilled, (state, action) => {
                state.isLoading = false;
                state.approvedProposals = action.payload;
            })
            .addCase(getApproved.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(getDeclined.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDeclined.fulfilled, (state, action) => {
                state.isLoading = false;
                state.declinedProposals = action.payload;
            })
            .addCase(getDeclined.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(getAuthClub.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAuthClub.fulfilled, (state, action) => {
                state.isLoading = false;
                state.authClub = action.payload;
            })
            .addCase(getAuthClub.rejected, (state, action) => {
                state.isLoading = false;
            });
    },
});

export const { add, update, remove, approve, decline, updatePassword } = clubSlice.actions;

export default clubSlice.reducer;
