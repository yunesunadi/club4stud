import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import notFoundImg from "../assets/images/404.png";

export default function Error() {
    return (
        <Box component="section" sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
        }}>
            <Box component="img" src={notFoundImg} alt="Page not found image" sx={{
                width: { xs: 190, md: 350 },
                height: { xs: 150, md: 250 },
                mb: 3
            }} />
            <Typography component="h5" variant="h5" mb={2}>Page not found</Typography>
            <Link to="/">
                <Typography sx={{ textDecoration: "underline", color: "black" }}>Back to home</Typography>
            </Link>
        </Box>
    )
}