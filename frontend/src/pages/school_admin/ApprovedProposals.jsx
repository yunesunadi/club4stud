import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getApproved } from "../../features/club/clubSlice";

export default function ApprovedProposals() {
    const { isLoading, approvedProposals } = useSelector((store) => store.club);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getApproved());
    }, []);

    return (
        <>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                approvedProposals?.map(club_proposal => {
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