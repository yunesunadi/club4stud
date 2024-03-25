import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, Grid } from '@mui/material';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancel, getRequested } from "../../features/clubMember/clubMemberSlice";
import { useAuth } from "../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Clubs() {
    const { isLoading, requestedClubs } = useSelector((store) => store.clubMember);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { authUser } = useAuth();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "student") {
                navigate("/");
            }
        } else {
            navigate("/");
        }

        dispatch(getRequested());
    }, []);

    return (
        <>
            <Typography color="primary" component="h1" variant="h5" mb={2}>Requested Clubs</Typography>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading && (
                <Grid container spacing={3} mb={3}>
                    {requestedClubs?.map(club => {
                        const { _id, name, description, purpose, member_fees, founded_date, email, phone_number, members } = club;

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
                                                <b>Name:</b> {name}
                                            </Typography>
                                            <Typography variant="body2" color="site.text">
                                                <b>Description:</b> {description}
                                            </Typography>
                                            <Typography variant="body2" color="site.text">
                                                <b>Purpose:</b> {purpose}
                                            </Typography>
                                            <Typography variant="body2" color="site.text">
                                                <b>Member Fees:</b> {member_fees} Ks
                                            </Typography>
                                            <Typography variant="body2" color="site.text">
                                                <b>Founded Date:</b> {founded_date}
                                            </Typography>
                                            <Typography variant="body2" color="site.text">
                                                <b>Email:</b> {email}
                                            </Typography>
                                            <Typography variant="body2" color="site.text">
                                                <b>Phone Number:</b> {phone_number}
                                            </Typography>
                                            <Button variant="outlined" sx={{ mt: 1 }} onClick={() => dispatch(cancel({ _id, student: authUser._id }))}>Cancel to join</Button>
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