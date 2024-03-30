import CircularProgress from "@mui/material/CircularProgress";
import { PieChart } from '@mui/x-charts/PieChart';

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllAttendanceByMember } from "../../features/schedule/scheduleSlice";
import { getAll } from "../../features/club/clubSlice";
import { Box, Typography } from "@mui/material";
import { getData } from "../school_admin/getData";

export default function OverallPieChart() {
    const { isLoading, allAttendanceByMember } = useSelector((store) => store.schedule);
    const { clubs } = useSelector((store) => store.club);
    const dispatch = useDispatch();
    const [result, setResult] = useState(0);

    useEffect(() => {
        dispatch(getAll());
        dispatch(getAllAttendanceByMember());
    }, []);

    useEffect(() => {
        const data = getData(allAttendanceByMember, clubs).map(({ _id, name, percent }) => ({ id: _id, value: percent, label: name }));
        setResult(data);
    }, [allAttendanceByMember])

    return (
        <Box>
            <Typography color="secondary" variant="subtitle1" mb={2}>Overall attendance %</Typography>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading && result.length > 0 && (
                <Box style={{ height: 250, overflowX: "auto" }}>
                    <PieChart
                        series={[{
                            data: result
                        }]}
                        width={900}
                    />
                </Box>
            )}
        </Box>
    );
}
