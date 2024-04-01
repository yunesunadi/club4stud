import "@fontsource-variable/lora";

import {
    Box,
    Typography,
} from "@mui/material";

import SportsScoreOutlinedIcon from '@mui/icons-material/SportsScoreOutlined';

export default function Logo() {
    return (
        <Box
            sx={{
                cursor: "pointer",
                display: "inline-flex",
                ml: { xs: .8, sm: 1.3 }
            }}
            alignItems="center"
            mt={0.3}
            color="site.logo"
        >
            <Typography
                variant="h6"
                component="h1"
                display="flex"
                alignItems="center"
            >
                Club<SportsScoreOutlinedIcon sx={{ transform: "scaleX(-1)", mx: -.2 }} />Stud
            </Typography>
        </Box>
    )
}