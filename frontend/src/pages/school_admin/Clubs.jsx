import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "../../features/club/clubSlice";

export default function Clubs() {
    const { isLoading, clubs } = useSelector((store) => store.club);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAll());
    }, []);

    return (
        <>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                clubs?.map(club => {
                    const { _id, name, description, email } = club;
                    return <div key={_id}>
                        <p>Club Name: {name}</p>
                        <p>Club description: {description}</p>
                        <p>Club email: {email}</p>
                    </div>;
                })
            )}
        </>
    )
}