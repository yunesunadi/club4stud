import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Grid } from '@mui/material';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "../../features/club/clubSlice";
import { useNavigate } from 'react-router-dom';

export default function Clubs() {
    const { isLoading, clubs } = useSelector((store) => store.club);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") !== "school_admin") {
                navigate("/");
            }
        } else {
            navigate("/");
        }

        dispatch(getAll());
    }, []);

    return (
        <>
            <Typography color="primary" component="h1" variant="h5" mb={2}>Clubs</Typography>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading && (
                <Grid container spacing={3} mb={3}>
                    {clubs?.map(club => {
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
                                            <Typography variant="body2" color="site.text">
                                                <b>No. of Members:</b> {members.length}
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