import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, remove } from "../../features/student/studentSlice";
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
                    const { _id, student_id, name, email, phone_number, gender, date_of_birth } = student;
                    return <div key={_id}>
                        <p>Student ID: {student_id}</p>
                        <p>Student Name: {name}</p>
                        <p>Student Email: {email}</p>
                        <Link to={`edit/${_id}`}>Edit</Link>
                        <button onClick={() => dispatch(remove(_id))}>Del</button>
                    </div>;
                })
            )}
        </>
    )
}