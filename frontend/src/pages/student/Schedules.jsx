import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJoined } from "../../features/schedule/scheduleSlice";

export default function Schedules() {
    const { isLoading, joinedSchedules } = useSelector((store) => store.schedule);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getJoined());
    }, []);

    return (
        <>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                joinedSchedules?.map(schedule => {
                    const { _id, description, date, start_time, end_time, location } = schedule;
                    return <div key={_id}>
                        <p>Description: {description}</p>
                        <p>Date: {date}</p>
                        <p>Start Time: {start_time}</p>
                        <p>End Time: {end_time}</p>
                        <p>Location: {location}</p>
                    </div>;
                })
            )}
        </>
    )
}