import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import MembersBarChart from "../../components/club_admin/MembersBarChart";
import { Typography } from "@mui/material";
import SchedulesLineChart from "../../components/club_admin/SchedulesLineChart";
import OverallGaugeChart from "../../components/club_admin/OverallGaugeChart";

export default function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "club_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }
    }, []);

    return (
        <>
            <Typography color="primary" component="h1" variant="h5" mb={2}>Dashboard</Typography>
            <MembersBarChart />
            <SchedulesLineChart />
            <OverallGaugeChart />
        </>
    )
}