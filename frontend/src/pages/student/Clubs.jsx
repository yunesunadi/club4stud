import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "../../features/club/clubSlice";
import { useAuth } from "../../providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { getRequested, join } from "../../features/clubMember/clubMemberSlice";

export default function Clubs() {
    const { isLoading, clubs } = useSelector((store) => store.club);
    const { requestedClubs } = useSelector((store) => store.clubMember);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { authUser } = useAuth();

    useEffect(() => {
        dispatch(getAll());
        dispatch(getRequested());
    }, []);

    const displayRequestBtn = (_id) => {
        const requestBtn = <button onClick={() => {
            dispatch(join({ _id, student: authUser._id }));
            navigate("/student/clubs/requested");
        }}>Request to join</button>;

        if (requestedClubs.length === 0) {
            return requestBtn;
        }

        requestedClubs.map(requestedClub => {
            if (requestedClub._id !== _id) {
                return requestBtn;
            }
        });
    }

    return (
        <>
            <Link to="requested">Requested</Link>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                clubs?.map(club => {
                    const { _id, name, description, email } = club;
                    return <div key={_id}>
                        <p>Club Name: {name}</p>
                        <p>Club description: {description}</p>
                        <p>Club email: {email}</p>
                        {displayRequestBtn(_id)}
                    </div>;
                })
            )}
        </>
    )
}