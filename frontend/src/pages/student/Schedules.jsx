import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Grid } from "@mui/material";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJoined } from "../../features/schedule/scheduleSlice";
import { useNavigate } from "react-router-dom";

export default function Schedules() {
    const { isLoading, joinedSchedules } = useSelector((store) => store.schedule);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "student") {
                navigate("/");
            }
        } else {
            navigate("/");
        }

        dispatch(getJoined());

        const alreadyLoaded = localStorage.getItem("alreadyLoaded");

        if (!alreadyLoaded) {
            localStorage.setItem("alreadyLoaded", true);
            window.location.reload();
        }
    }, []);

    return (
        <>
            <Typography color="primary" component="h1" variant="h5" mb={2}>Schedules</Typography>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading && (
                <Grid container spacing={3} mb={3}>
                    {joinedSchedules?.map(schedule => {
                        const { _id, description, start_date_time, end_date_time, location } = schedule;

                        return (
                            <Grid item xs={12} md={6} key={_id}>
                                <Card sx={{ width: "100%" }}>
                                    <CardContent>
                                        <Box sx={{
                                            "& > p": {
                                                mb: 1
                                            },
                                            "& > p:last-child": {
                                                mb: -1.5
                                            }
                                        }}>
                                            <Typography variant="body2" color="site.text">
                                                <b>Description:</b> {description}
                                            </Typography>
                                            <Typography variant="body2" color="site.text">
                                                <b>Start Date Time:</b> {start_date_time}
                                            </Typography>
                                            <Typography variant="body2" color="site.text">
                                                <b>End Date Time:</b> {end_date_time}
                                            </Typography>
                                            <Typography variant="body2" color="site.text">
                                                <b>Location:</b> {location}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>);
                    })}
                </Grid>
            )}
        </>
    )
}