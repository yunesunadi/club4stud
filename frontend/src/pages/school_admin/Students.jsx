import Box from "@mui/material/Box";
import {
    DataGrid,
    GridToolbar
} from "@mui/x-data-grid";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "../../features/student/studentSlice";
import { getAll as getBatches } from "../../features/batch/batchSlice";
import { format } from "date-fns";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function BatchStudents() {
    const { students } = useSelector((store) => store.student);
    const { batches } = useSelector((store) => store.batch);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "school_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }

        dispatch(getBatches());
        dispatch(getAll());
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
            field: "student_id",
            headerName: "Student ID",
            width: 150,
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
            field: "date_of_birth",
            headerName: "Date of Birth",
            width: 220,
        },
        {
            field: "created_at",
            headerName: "Created At",
            width: 270,
        },
        {
            field: "updated_at",
            headerName: "Updated At",
            width: 270,
        },
    ];

    return (
        <>
            <Typography color="primary" component="h1" variant="h5" mb={2}>Students</Typography>
            <Box sx={{ height: "80vh", width: "100%" }}>
                <DataGrid
                    rows={students.map((student, index) => {
                        return {
                            id: student._id,
                            no: index + 1,
                            ...student,
                            batch_name: batches.find(batch => batch._id === student.batch)?.name,
                            date_of_birth: format(student.date_of_birth, "hh:mm:ss a, MMM d, y"),
                            created_at: format(student.created_at, "hh:mm:ss a, MMM d, y"),
                            updated_at: format(student.updated_at, "hh:mm:ss a, MMM d, y")
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
                    pageSizeOptions={[5]}
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
        </>
    );
}
