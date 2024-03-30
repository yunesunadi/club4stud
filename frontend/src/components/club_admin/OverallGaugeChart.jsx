import CircularProgress from "@mui/material/CircularProgress";
import { Gauge } from '@mui/x-charts/Gauge';

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAttendanceByMember } from "../../features/schedule/scheduleSlice";
import { getClubMembers } from "../../features/clubMember/clubMemberSlice";
import { Box, Typography } from "@mui/material";
import { getData } from "./getData";

export default function OverallGaugeChart() {
    const { isLoading, attendanceByMember } = useSelector((store) => store.schedule);
    const { clubMembers } = useSelector((store) => store.clubMember);
    const dispatch = useDispatch();
    const [result, setResult] = useState(0);

    useEffect(() => {
        dispatch(getClubMembers());
        dispatch(getAttendanceByMember());
    }, []);

    useEffect(() => {
        const data = getData(attendanceByMember, clubMembers);
        const percentSum = data.reduce((previousValue, currentValue) => previousValue + currentValue.percent, 0.0).toFixed(2);
        const overallPercent = parseFloat((percentSum / data.length).toFixed(2));
        setResult(overallPercent);
    }, [attendanceByMember]);

    return (
        <Box>
            <Typography color="secondary" variant="subtitle1" mb={2} textAlign="center">Overall attendance %</Typography>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading && result && (
                <Box display="flex" alignContent="center">
                    <Gauge width={200} height={200} value={result} />
                </Box>
            )
            }
        </Box>
    );
}
