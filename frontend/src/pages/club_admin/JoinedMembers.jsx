import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
import {
    DataGrid, GridActionsCellItem
} from "@mui/x-data-grid";
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJoinedMembers, approve } from "../../features/clubMember/clubMemberSlice";
import { getAll as getBatches } from "../../features/batch/batchSlice";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function joinedMembers() {
    const [rows, setRows] = useState([]);

    const { isLoading, joinedMembers } = useSelector((store) => store.clubMember);
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
        dispatch(getJoinedMembers());
    }, []);

    useEffect(() => {
        setRows(joinedMembers?.map(({ student: member }, index) => {
            return {
                id: uuidv4(),
                no: index + 1,
                ...member,
                batch_name: batches.find(batch => batch._id === member.batch)?.name,
                created_at: format(member.created_at, "hh:mm:ss a, MMM d, y"),
            };
        }));
    }, [joinedMembers]);

    const handleApprove = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
        dispatch(approve(rows.find((row) => row.id === id)._id));
    }

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
            field: "created_at",
            headerName: "Joined At",
            width: 270,
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Approve",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<TaskAltOutlinedIcon color="primary" />}
                        label="Approve"
                        className="textPrimary"
                        onClick={handleApprove(id)}
                    />,
                ];
            },
        },
    ];

    return (
        <>
            <Typography color="primary" component="h1" variant="h5" mb={2}>Joined Members</Typography>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading && (
                <Box
                    sx={{
                        height: 400,
                        width: "100%",
                        "& .actions": {
                            color: "text.secondary",
                        },
                        "& .textPrimary": {
                            color: "text.primary",
                        },
                    }}
                >
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        editMode="row"
                        disableRowSelectionOnClick
                    />
                </Box>
            )}
        </>
    );
}
