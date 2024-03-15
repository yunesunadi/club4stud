import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClubMembers } from "../../features/clubMember/clubMemberSlice";

export default function ClubMembers() {
    const { isLoading, clubMembers } = useSelector((store) => store.clubMember);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getClubMembers());
    }, []);

    return (
        <>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                clubMembers?.map(({ student }) => {
                    const { _id, student_id, name, email, phone_number, gender, date_of_birth, batch } = student;
                    return <div key={_id}>
                        <p>Student ID: {student_id}</p>
                        <p>Student Name: {name}</p>
                        <p>Student Email: {email}</p>
                    </div>;
                })
            )}
        </>
    )
}