import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Grid } from '@mui/material';
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
                                        <Box mt={.5} display="flex" flexDirection="column" rowGap={1}>
                                            <Box display="flex" alignItems="center" columnGap={1}>
                                                <BadgeOutlinedIcon sx={{ color: "site.text" }} />
                                                <Typography variant="body2" color="site.text">
                                                    {name}
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