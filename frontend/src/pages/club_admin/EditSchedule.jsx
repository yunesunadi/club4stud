import { useRef, useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { update } from "../../features/schedule/scheduleSlice";
import { useNavigate, useParams } from "react-router-dom";

const validateSchema = Yup.object().shape({
    description: Yup.string().required("Description is required."),
    date: Yup.date().required("Date is required."),
    start_time: Yup.string().required("Start time is required."),
    end_time: Yup.string().required("End time is required."),
    location: Yup.string().required("Location is required."),
});

export default function EditSchedule() {
    const { id } = useParams();
    const descriptionRef = useRef();
    const dateRef = useRef();
    const startTimeRef = useRef();
    const endTimeRef = useRef();
    const locationRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState({});

    useEffect(() => {
        (async () => {
            const api = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/api/schedules/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { data } = await res.json();
            setSchedule(data[0].schedules);
        })();
    }, []);

    const formik = useFormik({
        initialValues: {
            description: "",
            date: "",
            start_time: "",
            end_time: "",
            location: "",
        },
        validationSchema: validateSchema,
    });

    const handleChange = useCallback(
        (key, value) =>
            formik.setValues({
                ...formik.values,
                [key]: value,
            }),
        [formik]
    );

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                const { description, date, start_time, end_time, location } = schedule;
                if (!description || !date || !start_time || !end_time || !location) return false;
                dispatch(update({ _id: id, description, date, start_time, end_time, location }));
                navigate(`/club_admin/club/schedules`);
            }}>
            <label htmlFor="description">Description</label>
            <input type="text" id="description" ref={descriptionRef} defaultValue={schedule.description}
                onChange={(e) => {
                    handleChange("description", e.target.value);
                    const description = descriptionRef.current.value;
                    setSchedule({ ...schedule, description });
                }} />
            {schedule.description === "" && formik.errors.description}
            <br />
            <label htmlFor="date">Date</label>
            <input type="date" id="date" ref={dateRef} defaultValue={schedule.date}
                onChange={(e) => {
                    handleChange("date", e.target.value);
                    const date = dateRef.current.value;
                    setSchedule({ ...schedule, date });
                }} />
            {schedule.date === "" && formik.errors.date}
            <br />
            <label htmlFor="start_time">Start Time</label>
            <input type="time" id="start_time" ref={startTimeRef} defaultValue={schedule.start_time}
                onChange={(e) => {
                    handleChange("start_time", e.target.value);
                    const start_time = startTimeRef.current.value;
                    setSchedule({ ...schedule, start_time });
                }} />
            {schedule.start_time === "" && formik.errors.start_time}
            <br />
            <label htmlFor="end_time">End Time</label>
            <input type="time" id="end_time" ref={endTimeRef} defaultValue={schedule.end_time}
                onChange={(e) => {
                    handleChange("end_time", e.target.value);
                    const end_time = endTimeRef.current.value;
                    setSchedule({ ...schedule, end_time });
                }} />
            {schedule.end_time === "" && formik.errors.end_time}
            <br />
            <label htmlFor="location">Location</label>
            <input type="text" id="location" ref={locationRef} defaultValue={schedule.location}
                onChange={(e) => {
                    handleChange("location", e.target.value);
                    const location = locationRef.current.value;
                    setSchedule({ ...schedule, location });
                }} />
            {schedule.location === "" && formik.errors.location}
            <button type="submit">Edit</button>
        </form>
    )
}