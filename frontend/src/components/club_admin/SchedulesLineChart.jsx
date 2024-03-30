import CircularProgress from "@mui/material/CircularProgress";
import { LineChart } from "@mui/x-charts/LineChart";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAttendanceByMember } from "../../features/schedule/scheduleSlice";
import { getClubMembers } from "../../features/clubMember/clubMemberSlice";
import { Box, Typography } from "@mui/material";
import { getData } from "./getData";

export default function SchedulesLineChart() {
    const { isLoading, attendanceByMember } = useSelector((store) => store.schedule);
    const { clubMembers } = useSelector((store) => store.clubMember);
    const dispatch = useDispatch();
    const [result, setResult] = useState([]);

    useEffect(() => {
        dispatch(getClubMembers());
        dispatch(getAttendanceByMember());
    }, []);

    useEffect(() => {
        setResult(getData(attendanceByMember, clubMembers));
    }, [attendanceByMember]);

    return (
        <Box>
            <Typography color="secondary" variant="subtitle1" mb={2}>Attendance percentage per each schedule</Typography>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading && result.length > 0 &&
                (
                    <Box style={{ height: 350, overflowX: "auto" }}>
                        <LineChart
                            width={1000}
                            series={[
                                { data: result?.map(({ percent }) => percent), label: "Attendance %" },
                            ]}
                            xAxis={[{ scaleType: "point", data: result?.map(({ description }) => description) }]}
                        />
                    </Box>
                )
            }
        </Box>
    );
}
