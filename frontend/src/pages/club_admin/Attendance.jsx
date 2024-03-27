import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAttendance, present, absent } from "../../features/schedule/scheduleSlice";
import { getAll as getBatches } from "../../features/batch/batchSlice";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Attendance() {
    const { isLoading, attendance: attend } = useSelector((store) => store.schedule);
    const { batches } = useSelector((store) => store.batch);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [forceUpdate, setForceUpdate] = useState(false);

    function handleForceUpdate() {
        setForceUpdate(prevState => !prevState);
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "club_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }

        dispatch(getBatches());
        handleForceUpdate();
    }, []);

    useEffect(() => {
        dispatch(getAttendance());
    }, [forceUpdate]);

    return (
        <>
            <Typography color="primary" component="h1" variant="h5" mb={2}>Attendance</Typography>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading && (
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell align="left">Batch Name</TableCell>
                                <TableCell align="left">Member Name</TableCell>
                                <TableCell align="left">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {attend.attendance?.map(({ student, present: isPresent, absent: isAbsent }, index) => {
                                return <TableRow
                                    key={student._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="left">{batches.find(batch => batch._id === student.batch)?.name}</TableCell>
                                    <TableCell align="left">{student.name}</TableCell>
                                    <TableCell align="left">
                                        <RadioGroup row name="attendance">
                                            <FormControlLabel value="present" control={<Radio />} label="Present"
                                                onChange={() => dispatch(present({ schedule_id: attend._id, student_id: student._id }))}
                                                checked={isPresent}
                                            />
                                            <FormControlLabel value="absent" control={<Radio />} label="Absent"
                                                onChange={() => dispatch(absent({ schedule_id: attend._id, student_id: student._id }))}
                                                checked={isAbsent}
                                            />
                                        </RadioGroup>
                                    </TableCell>
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
}