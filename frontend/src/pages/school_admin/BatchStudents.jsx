import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBatchAll, remove } from "../../features/student/studentSlice";
import { Link, useParams } from "react-router-dom";

export default function BatchStudents() {
    const { id } = useParams();
    const { isLoading, batchStudents } = useSelector((store) => store.student);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getBatchAll());
    }, []);

    return (
        <>
            <Link to={`/school_admin/batches/students/create/${id}`}>Add Student</Link>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                batchStudents?.map(student => {
                    const { _id, student_id, name, email, phone_number, gender, date_of_birth } = student;
                    return <div key={_id}>
                        <p>Student ID: {student_id}</p>
                        <p>Student Name: {name}</p>
                        <p>Student Email: {email}</p>
                        <Link to={`/school_admin/batches/students/${id}/edit/${_id}`}>Edit</Link>
                        <button onClick={() => dispatch(remove(_id))}>Del</button>
                    </div>;
                })
            )}
        </>
    )
}