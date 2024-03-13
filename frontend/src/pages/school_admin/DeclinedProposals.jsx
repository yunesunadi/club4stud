import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDeclined } from "../../features/club/clubSlice";

export default function DeclinedProposals() {
    const { isLoading, declinedProposals } = useSelector((store) => store.club);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getDeclined());
    }, []);

    return (
        <>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                declinedProposals?.map(club_proposal => {
                    const { _id, name, description, email } = club_proposal;
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