import { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { update } from "../../features/club/clubSlice";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

const validateSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    description: Yup.string().required("Description is required."),
    purpose: Yup.string().required("Purpose is required."),
    member_fees: Yup.number().required("Member fees is required."),
    founded_date: Yup.date().required("Founded date is required."),
    phone_number: Yup.number().required("Phone number is required."),
    email: Yup.string().email("Please enter a valid email.").required("Email is required."),
});

export default function EditProfileForm() {
    const nameRef = useRef();
    const descriptionRef = useRef();
    const purposeRef = useRef();
    const memberFeesRef = useRef();
    const foundedDateRef = useRef();
    const phoneNumberRef = useRef();
    const emailRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [club, setClub] = useState({});

    useEffect(() => {
        (async () => {
            const api = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/api/clubs/auth`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { data } = await res.json();
            setClub(data);
        })();
    }, []);

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            purpose: "",
            member_fees: "",
            founded_date: "",
            phone_number: "",
            email: "",
            password: "",
        },
        validationSchema: validateSchema,
    });

    const handleChange = useCallback(
        (key, value) =>
            formik.setValues({
                ...formik.values,
                [key]: value,
            }),
        [formik]
    );

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                const { name, description, purpose, member_fees, founded_date, phone_number, email } = club;
                if (!name || !description || !purpose || !member_fees || !founded_date || !phone_number || !email) return false;
                dispatch(update({ name, description, purpose, member_fees, founded_date, phone_number, email }));
                navigate(`/club_admin/dashboard`);
            }}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" ref={nameRef} defaultValue={club.name}
                onChange={(e) => {
                    handleChange("name", e.target.value);
                    const name = nameRef.current.value;
                    setClub({ ...club, name });
                }} />
            {club.name === "" && formik.errors.name}
            <br />
            <label htmlFor="description">Description</label>
            <textarea id="description" cols={30} rows={10} ref={descriptionRef} onChange={(e) => {
                handleChange("description", e.target.value);
                const description = descriptionRef.current.value;
                setClub({ ...club, description });
            }} defaultValue={club.description} />
            {club.description === "" && formik.errors.description}
            <br />
            <label htmlFor="purpose">Purpose</label>
            <textarea id="purpose" cols={30} rows={10} ref={purposeRef} onChange={(e) => {
                handleChange("purpose", e.target.value);
                const purpose = purposeRef.current.value;
                setClub({ ...club, purpose });
            }} defaultValue={club.purpose} />
            {club.purpose === "" && formik.errors.purpose}
            <br />
            <label htmlFor="member_fees">Member Fees</label>
            <input type="text" id="member_fees" ref={memberFeesRef} defaultValue={club.member_fees}
                onChange={(e) => {
                    handleChange("member_fees", e.target.value);
                    const member_fees = memberFeesRef.current.value;
                    setClub({ ...club, member_fees });
                }} />
            {club.member_fees === "" && formik.errors.member_fees}
            <br />
            <label htmlFor="founded_date">Founded Date</label>
            <input type="date" id="founded_date" ref={foundedDateRef} defaultValue={club.founded_date}
                onChange={(e) => {
                    handleChange("founded_date", e.target.value);
                    const founded_date = foundedDateRef.current.value;
                    setClub({ ...club, founded_date });
                }} />
            {club.founded_date === "" && formik.errors.founded_date}
            <br />
            <label htmlFor="phone_number">Phone Number</label>
            <input type="text" id="phone_number" ref={phoneNumberRef} defaultValue={club.phone_number}
                onChange={(e) => {
                    handleChange("phone_number", e.target.value);
                    const phone_number = phoneNumberRef.current.value;
                    setClub({ ...club, phone_number });
                }} />
            {club.phone_number === "" && formik.errors.phone_number}
            <br />
            <label htmlFor="email">Email</label>
            <input type="email" id="email" ref={emailRef} defaultValue={club.email}
                onChange={(e) => {
                    handleChange("email", e.target.value);
                    const email = emailRef.current.value;
                    setClub({ ...club, email });
                }} />
            {club.email === "" && formik.errors.email}
            <br />
            <button type="submit">Edit</button>
        </form>
    )
}