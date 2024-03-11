import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { update } from "../../features/academicYear/academicYearSlice";

export default function EditAcademicYear() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [academicYear, setAcademicYear] = useState({});
    const nameRef = useRef();

    useEffect(() => {
        (async () => {
            const api = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/api/academic_years/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { data } = await res.json();
            setAcademicYear(data);
        })();
    }, [])

    const handleChange = () => {
        const name = nameRef.current.value;
        setAcademicYear({ ...academicYear, name });
    }

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                dispatch(update({ _id: id, name: academicYear.name }));
                navigate("/school_admin/academic_years");
            }}>
            <input type="text" name="name" defaultValue={academicYear.name} ref={nameRef} onChange={handleChange} />
            <button type="submit">Edit</button>
        </form>
    )
}