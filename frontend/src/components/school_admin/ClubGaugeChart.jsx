import CircularProgress from "@mui/material/CircularProgress";
import Grid from '@mui/material/Grid';
import { Gauge } from '@mui/x-charts/Gauge';

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllAttendanceByMember } from "../../features/schedule/scheduleSlice";
import { getAll } from "../../features/club/clubSlice";
import { Box, Typography } from "@mui/material";
import { getData } from "../school_admin/getData";

export default function ClubGaugeChart() {
    const { isLoading, allAttendanceByMember } = useSelector((store) => store.schedule);
    const { clubs } = useSelector((store) => store.club);
    const dispatch = useDispatch();
    const [result, setResult] = useState(0);

    useEffect(() => {
        dispatch(getAll());
        dispatch(getAllAttendanceByMember());
    }, []);

    useEffect(() => {
        setResult(getData(allAttendanceByMember, clubs));
    }, [allAttendanceByMember])

    return (
        <Box>
            <Typography color="secondary" variant="subtitle1" mb={2}>Attendance % of all clubs</Typography>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}
            <Grid container spacing={3} justifyContent="center">
                {!isLoading && result.length > 0 && (
                    result.map(item => {
                        return (
                            <Grid item key={item._id} justifyContent="center" md={4}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Typography color="secondary" variant="body2" mb={2}>{item.name}'s attendance %</Typography>
                                    <Gauge width={100} height={100} value={item.percent} />
                                </Box>
                            </Grid>
                        )
                    })
                )}
            </Grid>
        </Box>
    );
}
