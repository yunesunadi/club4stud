import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, remove } from "../../features/batch/batchSlice";
import { Link } from "react-router-dom";

export default function Batches() {
    const { isLoading, batches } = useSelector((store) => store.batch);
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
                batches?.map(({ _id, name, founded_date }) => {
                    return <div key={_id}>
                        <p>Batch Name: {name}</p>
                        <p>Founded Date: {founded_date}</p>
                        <Link to={`edit/${_id}`}>Edit</Link>
                        <button onClick={() => dispatch(remove(_id))}>Del</button>
                    </div>;
                })
            )}
        </>
    )
}