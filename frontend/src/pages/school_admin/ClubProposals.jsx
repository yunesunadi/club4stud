import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { approve, decline, getAllProposals } from "../../features/club/clubSlice";
import { Link } from "react-router-dom";

export default function ClubProposals() {
    const { isLoading, clubProposals } = useSelector((store) => store.club);
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "school_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }

        dispatch(getAllProposals());
    }, []);

    return (
        <>
            <Link to="approved">Approved</Link>
            <Link to="declined">Declined</Link>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                clubProposals?.map(club_proposal => {
                    const { _id, name, description, email } = club_proposal;
                    return <div key={_id}>
                        <p>Club Name: {name}</p>
                        <p>Club description: {description}</p>
                        <p>Club email: {email}</p>
                        <button onClick={() => dispatch(approve(_id))}>Approve</button>
                        <button onClick={() => dispatch(decline(_id))}>Decline</button>
                    </div>;
                })
            )}
        </>
    )
}