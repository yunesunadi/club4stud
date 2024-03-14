import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMembers } from "../../features/clubMember/clubMemberSlice";
import { useNavigate } from "react-router-dom";

export default function JoinedMembers() {
    const { isLoading, members } = useSelector((store) => store.clubMember);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getMembers());
    }, []);

    return (
        <>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                members[0]?.members.map(({ student, request, approve }) => {
                    if (request && !approve) {
                        const { _id, student_id, name, email, phone_number, gender, date_of_birth, batch } = student;
                        return <div key={_id}>
                            <p>Student ID: {student_id}</p>
                            <p>Student Name: {name}</p>
                            <p>Student Email: {email}</p>
                            <button onClick={() => {
                                dispatch(approve(_id));
                                navigate("/club_admin/clubs/members");
                            }}>Approve</button>
                        </div>;
                    }
                })
            )}
        </>
    )
}