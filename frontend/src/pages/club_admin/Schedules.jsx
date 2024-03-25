import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, remove } from "../../features/schedule/scheduleSlice";
import { useNavigate } from "react-router-dom";

export default function Schedules() {
    const { isLoading, schedules: clubSchedules } = useSelector((store) => store.schedule);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "club_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }

        dispatch(getAll());
    }, []);

    return (
        <>
            <Typography color="primary" component="h1" variant="h5" mb={2}>Schedules</Typography>
            <Box sx={{
                display: "flex",
                justifyContent: "end",
                mb: 3
            }}>
                <Button onClick={() => navigate("create")} variant="outlined">
                    Add New
                </Button>
            </Box>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading && (
                <Grid container spacing={3} mb={3}>
                    {clubSchedules?.map(schedule => {
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
                                            <ButtonGroup variant="outlined" sx={{ mt: 1 }}>
                                                <Button onClick={() => navigate(`attendance/${_id}`)}>Make Attendance</Button>
                                                <Button onClick={() => navigate(`edit/${_id}`)}>Edit</Button>
                                                <Button onClick={() => dispatch(remove(_id))}>Delete</Button>
                                            </ButtonGroup>
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