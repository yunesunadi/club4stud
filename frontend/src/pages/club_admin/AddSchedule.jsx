import { useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { add } from "../../features/schedule/scheduleSlice";
import { useNavigate } from "react-router-dom";

const validateSchema = Yup.object().shape({
    description: Yup.string().required("Description is required."),
    date: Yup.date().required("Date is required."),
    start_time: Yup.string().required("Start time is required."),
    end_time: Yup.string().required("End time is required."),
    location: Yup.string().required("Location is required."),
});

export default function AddSchedule() {
    const descriptionRef = useRef();
    const dateRef = useRef();
    const startTimeRef = useRef();
    const endTimeRef = useRef();
    const locationRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                const description = descriptionRef.current.value;
                const date = dateRef.current.value;
                const start_time = startTimeRef.current.value;
                const end_time = endTimeRef.current.value;
                const location = locationRef.current.value;
                if (!description || !date || !start_time || !end_time || !location) return false;
                dispatch(add({ description, date, start_time, end_time, location }));
                navigate(`/club_admin/club/schedules`);
            }}>
            <label htmlFor="description">Description</label>
            <input type="text" id="description" ref={descriptionRef} value={formik.values.description}
                onChange={(e) => handleChange("description", e.target.value)} />
            {formik.errors.description}
            <br />
            <label htmlFor="date">Date</label>
            <input type="date" id="date" ref={dateRef} value={formik.values.date}
                onChange={(e) => handleChange("date", e.target.value)} />
            {formik.errors.date}
            <br />
            <label htmlFor="start_time">Start Time</label>
            <input type="time" id="start_time" ref={startTimeRef} value={formik.values.start_time}
                onChange={(e) => handleChange("start_time", e.target.value)} />
            {formik.errors.start_time}
            <br />
            <label htmlFor="end_time">End Time</label>
            <input type="time" id="end_time" ref={endTimeRef} value={formik.values.end_time}
                onChange={(e) => handleChange("end_time", e.target.value)} />
            {formik.errors.end_time}
            <br />
            <label htmlFor="location">Location</label>
            <input type="text" id="location" ref={locationRef} value={formik.values.location}
                onChange={(e) => handleChange("location", e.target.value)} />
            {formik.errors.location}
            <button type="submit">Add</button>
        </form>
    )
}