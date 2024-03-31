import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
import {
    DataGrid,
    GridToolbar
} from "@mui/x-data-grid";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClubMembers } from "../../features/clubMember/clubMemberSlice";
import { getAll as getBatches } from "../../features/batch/batchSlice";
import { format } from "date-fns";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ClubMembers() {
    const { isLoading, clubMembers } = useSelector((store) => store.clubMember);
    const { batches } = useSelector((store) => store.batch);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "club_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }

        dispatch(getBatches());
        dispatch(getClubMembers());
    }, []);

    const columns = [
        {
            field: "no",
            headerName: "No.",
            width: 70
        },
        {
            field: "batch_name",
            headerName: "Batch",
            width: 220,
        },
        {
            field: "name",
            headerName: "Name",
            width: 220,
        },
        {
            field: "email",
            headerName: "Email",
            width: 220,
        },
        {
            field: "phone_number",
            headerName: "Phone Number",
            width: 220,
        },
        {
            field: "gender",
            headerName: "Gender",
            width: 220,
        },
        {
            field: "updated_at",
            headerName: "Member Since",
            width: 220,
        },
    ];

    return (
        <>
            <Typography color="primary" component="h1" variant="h5" mb={2}>Club Members</Typography>
            <Box sx={{
                display: "flex",
                justifyContent: "end",
                mb: 3
            }}>
                <Button onClick={() => navigate("joined")} variant="outlined">
                    Joined Members
                </Button>
            </Box>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading && (
                <Box sx={{ height: 430, width: "100%", mb: 3 }}>
                    <DataGrid
                        rows={clubMembers?.map(({ student: member }, index) => {
                            return {
                                id: member._id,
                                no: index + 1,
                                ...member,
                                batch_name: batches.find(batch => batch._id === member.batch)?.name,
                                updated_at: format(member.updated_at, "hh:mm:ss a, MMM d, y"),
                            };
                        })}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                        disableRowSelectionOnClick
                        disableDensitySelector
                    />
                </Box>
            )}
        </>
    );
}
