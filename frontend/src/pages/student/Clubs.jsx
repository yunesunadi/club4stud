import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, Grid } from '@mui/material';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import AdsClickOutlinedIcon from '@mui/icons-material/AdsClickOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "../../features/club/clubSlice";
import { useAuth } from "../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { getRequested, getJoined, join } from "../../features/clubMember/clubMemberSlice";

export default function Clubs() {
    const { isLoading, clubs } = useSelector((store) => store.club);
    const { requestedClubs, joinedClubs } = useSelector((store) => store.clubMember);
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
        dispatch(getJoined());
        dispatch(getAll());
    }, []);

    return (
        <>
            <Typography color="primary" component="h1" variant="h5" mb={2}>Clubs</Typography>
            <Box sx={{
                display: "flex",
                justifyContent: "end",
                columnGap: 1.5,
                mb: 3
            }}>
                <Button onClick={() => navigate("send_proposal")} variant="outlined">
                    Send Proposal
                </Button>
                <Button onClick={() => navigate("requested")} variant="outlined">
                    Requested Clubs
                </Button>
            </Box>
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
                                        <Box mt={.5} display="flex" flexDirection="column" rowGap={1}>
                                            <Box display="flex" alignItems="center" columnGap={1}>
                                                <BadgeOutlinedIcon sx={{ color: "site.text" }} />
                                                <Typography variant="body2" color="site.text">
                                                    {name} <b>{joinedClubs.map(joinedClub => {
                                                        if (joinedClub._id === _id) {
                                                            return "(Joined)";
                                                        }
                                                    })}</b>
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" columnGap={1}>
                                                <ArticleOutlinedIcon sx={{ color: "site.text" }} />
                                                <Typography variant="body2" color="site.text">
                                                    {description}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" columnGap={1}>
                                                <AdsClickOutlinedIcon sx={{ color: "site.text" }} />
                                                <Typography variant="body2" color="site.text">
                                                    {purpose}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" columnGap={1}>
                                                <PaidOutlinedIcon sx={{ color: "site.text" }} />
                                                <Typography variant="body2" color="site.text">
                                                    {member_fees} Ks
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" columnGap={1}>
                                                <DateRangeOutlinedIcon sx={{ color: "site.text" }} />
                                                <Typography variant="body2" color="site.text">
                                                    Founded at {founded_date}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" columnGap={1}>
                                                <EmailOutlinedIcon sx={{ color: "site.text" }} />
                                                <Typography variant="body2" color="site.text">
                                                    {email}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" columnGap={1}>
                                                <LocalPhoneOutlinedIcon sx={{ color: "site.text" }} />
                                                <Typography variant="body2" color="site.text">
                                                    {phone_number}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" columnGap={1}>
                                                <PersonOutlineOutlinedIcon sx={{ color: "site.text" }} />
                                                <Typography variant="body2" color="site.text">
                                                    {members.filter(member => member.request && member.approve).length} members
                                                </Typography>
                                            </Box>
                                            <Button key={_id} variant="outlined" onClick={() => {
                                                dispatch(join({ _id, student: authUser._id }));
                                                navigate("/student/clubs/requested");
                                            }}
                                                sx={{
                                                    mt: 1,
                                                    display: joinedClubs.filter(joinedClub => joinedClub._id === _id)
                                                        .map(() => {
                                                            return "none";
                                                        })[0],
                                                }}
                                                disabled={
                                                    requestedClubs.filter(requestedClub => requestedClub._id === _id).map(() => {
                                                        return true;
                                                    })[0]
                                                }
                                            >
                                                Request to join
                                            </Button >
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