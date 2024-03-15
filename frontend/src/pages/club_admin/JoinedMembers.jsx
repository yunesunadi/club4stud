import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJoinedMembers, approve } from "../../features/clubMember/clubMemberSlice";
import { useNavigate } from "react-router-dom";

export default function JoinedMembers() {
    const { isLoading, joinedMembers } = useSelector((store) => store.clubMember);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getJoinedMembers());
    }, []);

    return (
        <>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                joinedMembers?.map(({ student }) => {
                    const { _id, student_id, name, email, phone_number, gender, date_of_birth, batch } = student;
                    return <div key={_id}>
                        <p>Student ID: {student_id}</p>
                        <p>Student Name: {name}</p>
                        <p>Student Email: {email}</p>
                        <button onClick={() => {
                            dispatch(approve(_id));
                            navigate("/club_admin/club/members");
                        }}>Approve</button>
                    </div>;
                })
            )}
        </>
    )
}