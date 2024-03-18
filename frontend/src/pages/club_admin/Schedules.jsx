import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, remove } from "../../features/schedule/scheduleSlice";
import { Link } from "react-router-dom";

export default function Schedules() {
    const { isLoading, schedules: clubSchedules } = useSelector((store) => store.schedule);
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "club_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }

        dispatch(getAll());
    }, []);

    return (
        <>
            <Link to="create">Add</Link>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                clubSchedules?.map(schedule => {
                    const { _id, description, date, start_time, end_time, location } = schedule;
                    return <div key={_id}>
                        <p>Description: {description}</p>
                        <p>Date: {date}</p>
                        <p>Start Time: {start_time}</p>
                        <p>End Time: {end_time}</p>
                        <p>Location: {location}</p>
                        <Link to={`attendance/${_id}`}>Make Attendance</Link>
                        <Link to={`edit/${_id}`}>Edit</Link>
                        <button onClick={() => dispatch(remove(_id))}>Del</button>
                    </div>;
                })
            )}
        </>
    )
}