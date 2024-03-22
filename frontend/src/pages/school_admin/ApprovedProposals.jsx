import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { getApproved } from "../../features/club/clubSlice";
import { getAll as getAllStudents } from "../../features/student/studentSlice";
import { getAll as getAllBatches } from "../../features/batch/batchSlice";
import { Box, Grid } from '@mui/material';

export default function ApprovedProposals() {
    const { isLoading, approvedProposals } = useSelector((store) => store.club);
    const { students } = useSelector((store) => store.student);
    const { batches } = useSelector((store) => store.batch);
    const dispatch = useDispatch();

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
        dispatch(getApproved());
    }, []);

    return (
        <>
            <Typography color="primary" component="h1" variant="h5" mb={2}>Approved Proposals</Typography>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading && (
                <Grid container spacing={3} mb={3}>
                    {approvedProposals?.map(club_proposal => {
                        const { _id, name, description, purpose, member_fees, founded_date, email, phone_number, owner, created_at } = club_proposal;

                        return (
                            <Grid item xs={12} md={6}>
                                <Card sx={{ width: "100%" }}>
                                    <CardContent>
                                        <Box key={_id} sx={{
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
                                                <b>Sent By:</b> {students.find(({ _id }) => _id === owner)?.name} (Batch {batches.find(({ _id }) =>
                                                    students.find(({ batch }) => batch === _id)
                                                )?.name})
                                            </Typography>
                                            <Typography variant="body2" color="site.text">
                                                <b>Sent At:</b> {format(created_at, "hh:mm:ss a, MMM d, y")}
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