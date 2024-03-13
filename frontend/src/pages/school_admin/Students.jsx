import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "../../features/student/studentSlice";
import { Link } from "react-router-dom";

export default function Students() {
    const { isLoading, students } = useSelector((store) => store.student);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAll());
    }, []);

    return (
        <>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                students?.map(student => {
                    const { _id, student_id, name, email, phone_number, gender, date_of_birth, batch } = student;
                    return <div key={_id}>
                        <p>Student ID: {student_id}</p>
                        <p>Student Name: {name}</p>
                        <p>Student Email: {email}</p>
                        <Link to={`/school_admin/batches/students/${batch}`}>batch</Link>
                    </div>;
                })
            )}
        </>
    )
}