import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancel, getRequested } from "../../features/clubMember/clubMemberSlice";
import { useAuth } from "../../providers/AuthProvider";

export default function RequestedClubs() {
    const { isLoading, requestedClubs } = useSelector((store) => store.clubMember);
    const dispatch = useDispatch();
    const { authUser } = useAuth();

    useEffect(() => {
        dispatch(getRequested());
    }, []);

    return (
        <>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                requestedClubs?.map(club => {
                    const { _id, name, description, email } = club;
                    return <div key={_id}>
                        <p>Club Name: {name}</p>
                        <p>Club description: {description}</p>
                        <p>Club email: {email}</p>
                        <button onClick={() => dispatch(cancel({ _id, student: authUser._id }))}>Cancel to join</button>
                    </div>;
                })
            )}
        </>
    )
}