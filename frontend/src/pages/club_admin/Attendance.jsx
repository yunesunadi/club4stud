import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAttendance, present, absent } from "../../features/schedule/scheduleSlice";

export default function Attendance() {
    const { isLoading, attendance: attend } = useSelector((store) => store.schedule);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAttendance());
    }, []);

    return (
        <>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                attend.attendance?.map(({ student, present: isPresent, absent: isAbsent }) => {
                    return <div key={student._id}>
                        <p>Student: {student.name}</p>
                        <button disabled={isPresent} style={{ fontWeight: isPresent && "bold" }} onClick={() => dispatch(present({ schedule_id: attend._id, student_id: student._id }))}>Present</button>
                        <button disabled={isAbsent} style={{ fontWeight: isAbsent && "bold" }} onClick={() => dispatch(absent({ schedule_id: attend._id, student_id: student._id }))}>Absent</button>
                    </div>;
                })
            )}
        </>
    )
}