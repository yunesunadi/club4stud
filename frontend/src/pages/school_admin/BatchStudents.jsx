import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from "@mui/x-data-grid";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBatchAll, add, update, remove } from "../../features/student/studentSlice";
import { getAll } from "../../features/batch/batchSlice";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { Typography } from "@mui/material";
import AlertSnackBar from "../../components/school_admin/AlertSnackBar";
import { useNavigate, useParams } from "react-router-dom";

export default function BatchStudents() {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});

    const { isLoading, batchStudents } = useSelector((store) => store.student);
    const { batches } = useSelector((store) => store.batch);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: batchId } = useParams();

    const [errors, setErrors] = useState([]);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "school_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }

        dispatch(getBatchAll());
        dispatch(getAll());
    }, []);

    useEffect(() => {
        setRows(batchStudents.map((student, index) => {
            return {
                id: uuidv4(),
                no: index + 1,
                ...student,
                date_of_birth: new Date(student.date_of_birth),
                created_at: format(student.created_at, "hh:mm:ss a, MMM d, y"),
                updated_at: format(student.updated_at, "hh:mm:ss a, MMM d, y")
            };
        }));
    }, [batchStudents]);

    function EditToolbar(props) {
        const { setRows, setRowModesModel } = props;

        const handleClick = () => {
            const id = uuidv4();
            setRows((oldRows) => [...oldRows, {
                id,
                no: oldRows.length + 1,
                student_id: "",
                name: "",
                email: "",
                phone_number: "",
                gender: "",
                date_of_birth: "",
                created_at: format(new Date(), "hh:mm:ss a, MMM d, y"),
                updated_at: format(new Date(), "hh:mm:ss a, MMM d, y"),
                isNew: true
            }]);
            setRowModesModel((oldModel) => ({
                ...oldModel,
                [id]: { mode: GridRowModes.Edit, fieldToFocus: "student_id" },
            }));
        };

        return (
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                    Add New
                </Button>
            </GridToolbarContainer>
        );
    }

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
        dispatch(remove(rows.find((row) => row.id === id)._id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

        if (!newRow.student_id) {
            setErrors(prevState => ([...prevState, "Student ID is required."]));
        }

        if (!newRow.name) {
            setErrors(prevState => ([...prevState, "Name is required."]));
        }

        if (!newRow.email) {
            setErrors(prevState => ([...prevState, "Email is required."]));
        }

        if (!newRow.phone_number) {
            setErrors(prevState => ([...prevState, "Phone number is required."]));
        }

        if (!newRow.gender) {
            setErrors(prevState => ([...prevState, "Gender is required."]));
        }

        if (!newRow.date_of_birth) {
            setErrors(prevState => ([...prevState, "Date of birth is required."]));
        }

        if (!newRow.student_id || !newRow.name || !newRow.email || !newRow.phone_number || !newRow.gender || !newRow.date_of_birth) {
            const editedRow = rows.find((row) => row.id === newRow.id);
            if (editedRow.isNew) {
                setRows(rows.filter((row) => row.id !== newRow.id));
            }

            return false;
        }

        if (newRow.isNew) {
            dispatch(add({
                ...newRow,
                date_of_birth: format(newRow.date_of_birth, "M/d/y"),
                password: batches.find(({ _id }) => _id === batchId).default_password,
                batch: batchId
            }));
        } else {
            const updatedData = {
                _id: newRow._id,
                student_id: newRow.student_id,
                name: newRow.name,
                email: newRow.email,
                phone_number: newRow.phone_number,
                gender: newRow.gender,
                date_of_birth: format(newRow.date_of_birth, "M/d/y"),
                password: batches.find(({ _id }) => _id === batchId).default_password,
                batch: batchId,
                updated_at: format(new Date(), "hh:mm:ss a, MMM d, y")
            };
            dispatch(update(updatedData));
        }

        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleProcessRowUpdateError = useCallback((error) => {
        setShowAlert(true);
        console.log(error);
    }, []);

    const columns = [
        {
            field: "no",
            headerName: "No.",
            width: 70
        },
        {
            field: "student_id",
            headerName: "Student ID",
            width: 220,
            editable: true
        },
        {
            field: "name",
            headerName: "Name",
            width: 220,
            editable: true
        },
        {
            field: "email",
            headerName: "Email",
            width: 220,
            editable: true
        },
        {
            field: "phone_number",
            headerName: "Phone Number",
            width: 220,
            editable: true
        },
        {
            field: "gender",
            headerName: "Gender",
            width: 220,
            type: "singleSelect",
            valueOptions: ["Male", "Female", "Other"],
            editable: true,
        },
        {
            field: "date_of_birth",
            headerName: "Date of Birth",
            type: "date",
            width: 220,
            editable: true
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
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 130,
            cellClassName: "actions",
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon color="primary" />}
                            label="Save"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon color="primary" />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon color="primary" />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon color="primary" />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                    />,
                ];
            },
        },
    ];

    return (
        <>
            {errors && <AlertSnackBar errors={errors} showAlert={showAlert} setShowAlert={setShowAlert} />}
            <Typography color="primary" component="h1" variant="h5" mb={2}>Batch {batches.find(({ _id }) => _id === batchId).name}'s Students</Typography>
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
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        onProcessRowUpdateError={handleProcessRowUpdateError}
                        slots={{
                            toolbar: EditToolbar,
                        }}
                        slotProps={{
                            toolbar: { setRows, setRowModesModel },
                        }}
                        disableRowSelectionOnClick
                    />
                </Box>
            )}
        </>
    );
}
