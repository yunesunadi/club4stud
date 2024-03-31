import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Grid } from "@mui/material";
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "../../features/club/clubSlice";
import { getJoined } from "../../features/schedule/scheduleSlice";
import { useNavigate } from "react-router-dom";
import { format, formatDistance, subDays } from "date-fns";

export default function Schedules() {
    const { clubs } = useSelector((store) => store.club);
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

        dispatch(getAll());
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
                    {joinedSchedules[1]?.map(schedule => {
                        const { _id, description, start_date_time, end_date_time, location, created_at } = schedule;
                        const club_name = clubs?.find(({ _id }) => _id === joinedSchedules[0])?.name;

                        return (
                            <Grid item xs={12} md={6} key={_id}>
                                <Card sx={{ width: "100%" }}>
                                    <CardHeader
                                        avatar={
                                            <Avatar sx={{ bgcolor: "primary.main" }}>
                                                {club_name && club_name[0]}
                                            </Avatar>
                                        }
                                        title={club_name}
                                        subheader={
                                            <Tooltip title={format(created_at, "hh:mm:ss a, MMM d, y")}>
                                                Posted {formatDistance(subDays(created_at, 3), new Date(), { addSuffix: true })}
                                            </Tooltip>
                                        }
                                    />
                                    <CardContent>
                                        <Typography variant="subtitle1" color="site.text">
                                            {description}
                                        </Typography>
                                        <Box mt={3} display="flex" flexDirection="column" rowGap={1}>
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
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>);
                    })}
                </Grid >
            )}
        </>
    )
}