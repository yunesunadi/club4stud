import { Box, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ClubGaugeChart from "../../components/school_admin/ClubGaugeChart";
import OverallPieChart from "../../components/school_admin/OverallPieChart";

export default function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "school_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }

        const alreadyLoaded = localStorage.getItem("alreadyLoaded");

        if (!alreadyLoaded) {
            localStorage.setItem("alreadyLoaded", true);
            window.location.reload();
        }
    }, []);

    return (
        <>
            <Typography color="primary" component="h1" variant="h5" mb={2}>Dashboard</Typography>
            <Box display="flex" flexDirection="column" sx={{ rowGap: 3, mb: 2 }}>
                <OverallPieChart />
                <ClubGaugeChart />
            </Box>
        </>
    );
}