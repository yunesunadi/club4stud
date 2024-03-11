import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { getAll, remove } from "../../features/academicYear/academicYearSlice";
import { Link } from "react-router-dom";

export default function AcademicYears() {
    const { isLoading, academicYears } = useSelector((store) => store.academicYear);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAll());
    }, []);

    return (
        <>
            <Link to="create">Add</Link>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                academicYears?.map(({ _id, name }) => {
                    return <div key={_id}>
                        <p>Academic Name: {name}</p>
                        <Link to={`edit/${_id}`}>Edit</Link>
                        <button onClick={() => dispatch(remove(_id))}>Del</button>
                    </div>;
                })
            )}
        </>
    )
}