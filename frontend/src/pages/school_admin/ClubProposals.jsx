import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import DoDisturbAltOutlinedIcon from '@mui/icons-material/DoDisturbAltOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import ScheduleSendOutlinedIcon from '@mui/icons-material/ScheduleSendOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import AdsClickOutlinedIcon from '@mui/icons-material/AdsClickOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { approve, decline, getAllProposals } from "../../features/club/clubSlice";
import { getAll as getAllStudents } from "../../features/student/studentSlice";
import { getAll as getAllBatches } from "../../features/batch/batchSlice";
import { useNavigate } from "react-router-dom";
import { Box, Grid } from '@mui/material';

export default function ClubProposals() {
    const { isLoading, clubProposals } = useSelector((store) => store.club);
    const { students } = useSelector((store) => store.student);
    const { batches } = useSelector((store) => store.batch);
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

        dispatch(getAllStudents());
        dispatch(getAllBatches());
        dispatch(getAllProposals());
    }, []);

    return (
        <>
            <Typography color="primary" component="h1" variant="h5" mb={2}>Club Proposals</Typography>
            <Box sx={{
                display: "flex",
                justifyContent: "end",
                columnGap: 2,
                mb: 3
            }}>
                <Button onClick={() => navigate("approved")} variant="outlined">
                    Approved Proposals
                </Button>
                <Button onClick={() => navigate("declined")} variant="outlined">
                    Declined Proposals
                </Button>
            </Box>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading && (
                <Grid container spacing={3} mb={3}>
                    {clubProposals?.map(club_proposal => {
                        const { _id, name, description, purpose, member_fees, founded_date, email, phone_number, owner, created_at } = club_proposal;

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
                                                <DateRangeOutlinedIcon sx={{ color: "site.text" }} />
                                                <Typography variant="body2" color="site.text">
                                                    Founded at {founded_date}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" columnGap={1}>
                                                <PaidOutlinedIcon sx={{ color: "site.text" }} />
                                                <Typography variant="body2" color="site.text">
                                                    {member_fees} Ks
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
                                                    Sent by {students.find(({ _id }) => _id === owner)?.name} (Batch {batches.find(({ _id }) =>
                                                        students.find(({ _id: student_id, batch }) => batch === _id && student_id === owner)
                                                    )?.name})
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" columnGap={1}>
                                                <ScheduleSendOutlinedIcon sx={{ color: "site.text" }} />
                                                <Typography variant="body2" color="site.text">
                                                    Sent at {format(created_at, "hh:mm:ss a, MMM d, y")}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                    <CardActions sx={{ mb: .5 }}>
                                        <Button onClick={() => dispatch(approve(_id))}>
                                            <TaskAltOutlinedIcon fontSize="small" sx={{ mr: .5 }} /> Approve
                                        </Button>
                                        <Button onClick={() => dispatch(decline(_id))}>
                                            <DoDisturbAltOutlinedIcon fontSize="small" sx={{ mr: .5 }} /> Decline
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>);
                    })}
                </Grid>
            )}
        </>
    )
}