import CircularProgress from "@mui/material/CircularProgress";
import { LineChart } from "@mui/x-charts/LineChart";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAttendanceByMember } from "../../features/schedule/scheduleSlice";
import { getClubMembers } from "../../features/clubMember/clubMemberSlice";
import { Box, Typography } from "@mui/material";

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
        let presentCount = [];

        attendanceByMember.forEach(schedule => {
            const scheduleId = schedule._id;
            schedule.attendance.forEach(attendance => {
                if (!presentCount[scheduleId]) {
                    presentCount[scheduleId] = {
                        schedule_id: scheduleId,
                        description: schedule.description,
                        count: 0,
                        created_at: schedule.created_at
                    };
                }

                if (attendance.present) {
                    presentCount[scheduleId].count++;
                }
            });
        });

        const schedulesPresent = Object.keys(presentCount).map(scheduleId => {
            return presentCount[scheduleId];
        });

        const allMembersCount = clubMembers?.length;

        const data = schedulesPresent.map(({ schedule_id, description, count, created_at }) => {
            const percent = (count / allMembersCount) * 100;

            return {
                schedule_id,
                description,
                percent,
                created_at
            };
        }).sort((a, b) => {
            const aTime = new Date(a.created_at).getTime();
            const bTime = new Date(b.created_at).getTime();
            return aTime - bTime;
        });

        setResult(data);
    }, [attendanceByMember]);

    return (
        <>
            <Typography color="secondary" variant="body2" mb={2}>Attendance percentage per each schedule</Typography>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading && result.length > 0 &&
                (
                    <Box style={{ height: 300, overflowX: "auto" }}>
                        <LineChart
                            width={900}
                            series={[
                                { data: result?.map(({ percent }) => percent), label: "Attendance %" },
                            ]}
                            xAxis={[{ scaleType: "point", data: result?.map(({ description }) => description) }]}
                        />
                    </Box>
                )
            }
        </>
    );
}
