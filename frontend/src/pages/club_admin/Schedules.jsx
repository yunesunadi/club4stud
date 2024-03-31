import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ScheduleSendOutlinedIcon from '@mui/icons-material/ScheduleSendOutlined';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, remove } from "../../features/schedule/scheduleSlice";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

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
                        const { _id, description, start_date_time, end_date_time, location, created_at } = schedule;

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
                                            <Box mt={1} mb={1.5} display="flex" flexDirection="column" rowGap={1}>
                                                <Box display="flex" alignItems="center" columnGap={1}>
                                                    <ArticleOutlinedIcon sx={{ color: "site.text" }} />
                                                    <Typography variant="body2" color="site.text">
                                                        {description}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center" columnGap={1}>
                                                    <DateRangeOutlinedIcon sx={{ color: "site.text" }} />
                                                    <Typography variant="body2" color="site.text">
                                                        From {start_date_time}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center" columnGap={1}>
                                                    <DateRangeOutlinedIcon sx={{ color: "site.text" }} />
                                                    <Typography variant="body2" color="site.text">
                                                        To {end_date_time}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center" columnGap={1}>
                                                    <RoomOutlinedIcon sx={{ color: "site.text" }} />
                                                    <Typography variant="body2" color="site.text">
                                                        {location}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center" columnGap={1}>
                                                    <ScheduleSendOutlinedIcon sx={{ color: "site.text" }} />
                                                    <Typography variant="body2" color="site.text">
                                                        Posted at {format(created_at, "hh:mm:ss a, MMM d, y")}
                                                    </Typography>
                                                </Box>
                                            </Box>
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