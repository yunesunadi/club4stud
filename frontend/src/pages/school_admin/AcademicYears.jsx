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
import { getAll, add, update, remove } from "../../features/academicYear/academicYearSlice";
import { format } from "date-fns";
import { v4 as uuidv4 } from 'uuid';
import { Typography } from "@mui/material";
import AlertSnackBar from "../../components/school_admin/AlertSnackBar";

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = uuidv4();
        setRows((oldRows) => [...oldRows, {
            id,
            no: oldRows.length + 1,
            name: "",
            created_at: format(new Date(), "hh:mm:ss a, MMM d, y"),
            updated_at: format(new Date(), "hh:mm:ss a, MMM d, y"),
            isNew: true
        }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
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

export default function AcademicYears() {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});

    const { isLoading, academicYears } = useSelector((store) => store.academicYear);
    const dispatch = useDispatch();

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

        dispatch(getAll());
    }, []);

    useEffect(() => {
        setRows(academicYears.map((acy, index) => {
            return {
                id: uuidv4(),
                no: index + 1,
                ...acy,
                created_at: format(acy.created_at, "hh:mm:ss a, MMM d, y"),
                updated_at: format(acy.updated_at, "hh:mm:ss a, MMM d, y")
            };
        }));
    }, [academicYears]);

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

        if (!newRow.name) {
            setErrors(["Name is required."]);

            const editedRow = rows.find((row) => row.id === newRow.id);
            if (editedRow.isNew) {
                setRows(rows.filter((row) => row.id !== newRow.id));
            }

            return false;
        }

        if (newRow.isNew) {
            dispatch(add(newRow.name));
        } else {
            dispatch(update({ _id: newRow._id, name: newRow.name, updated_at: format(new Date(), "hh:mm:ss a, MMM d, y") }));
        }

        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleProcessRowUpdateError = useCallback((error) => {
        setShowAlert(true);
    }, []);


    const columns = [
        {
            field: "no",
            headerName: "No.",
            width: 70
        },
        {
            field: "name",
            headerName: "Name",
            width: 250,
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
            width: 100,
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
            <Typography color="primary" component="h1" variant="h5" mb={2}>Academic Years</Typography>
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
