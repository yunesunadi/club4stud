import { useRef } from "react";
import { useDispatch } from "react-redux";
import { add } from "../../features/academicYear/academicYearSlice";
import { useNavigate } from "react-router-dom";

export default function AddAcademicYears() {
    const nameRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                const name = nameRef.current.value;
                dispatch(add(name));
                navigate("/school_admin/academic_years");
            }}>
            <input type="text" name="name" ref={nameRef} />
            <button type="submit">Add</button>
        </form>
    )
}