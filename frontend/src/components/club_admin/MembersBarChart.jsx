import CircularProgress from "@mui/material/CircularProgress";
import { BarChart } from "@mui/x-charts/BarChart";

import { useDispatch, useSelector } from "react-redux";
import { getAttendanceByMember } from "../../features/schedule/scheduleSlice";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

export default function MembersBarChart() {
    const { isLoading, attendanceByMember } = useSelector((store) => store.schedule);
    const dispatch = useDispatch();
    const [result, setResult] = useState([]);

    useEffect(() => {
        dispatch(getAttendanceByMember());
    }, []);

    useEffect(() => {
        let attendanceCount = [];

        attendanceByMember.forEach(schedule => {
            schedule.attendance.forEach(attendance => {
                const studentId = attendance.student._id;

                if (!attendanceCount[studentId]) {
                    attendanceCount[studentId] = {
                        name: attendance.student.name,
                        presentCount: 0,
                        absentCount: 0
                    };
                }

                if (attendance.present) {
                    attendanceCount[studentId].presentCount++;
                } else if (attendance.absent) {
                    attendanceCount[studentId].absentCount++;
                }
            });
        });

        setResult(
            Object.keys(attendanceCount).map(studentId => {
                const studentAttendance = attendanceCount[studentId];
                return studentAttendance;
            })
        );
    }, [attendanceByMember]);

    return (
        <>
            <Typography color="secondary" variant="body2" mb={2}>Number of schedules per each member</Typography>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading && result.length > 0 &&
                (
                    <Box style={{ height: 300, overflowX: "auto" }}>
                        <BarChart
                            width={900}
                            series={[
                                { data: result.map(({ presentCount }) => presentCount), label: "Present", id: "present" },
                                { data: result.map(({ absentCount }) => absentCount), label: "Absent", id: "absent" },
                            ]}
                            xAxis={[{ data: result.map(({ name }) => name), scaleType: "band" }]}
                        />
                    </Box>
                )
            }
        </>
    );
}
