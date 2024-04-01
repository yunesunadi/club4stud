import "@fontsource-variable/lora";

import {
    AppBar,
    Container,
    Toolbar,
    Divider,
    List,
    Box,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import FeaturedPlayListOutlinedIcon from '@mui/icons-material/FeaturedPlayListOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Link, NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import AccountMenu from "./components/school_admin/AccountMenu";
import ModeSwitch from "./components/ModeSwitch";
import { useAppTheme } from "./providers/AppThemeProvider";
import Logo from "./components/Logo";

const openedMixin = (theme) => ({
    width: 210,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "desktopOpen",
})(({ theme, desktopOpen }) => ({
    width: 210,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(desktopOpen && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!desktopOpen && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

const listItems = [
    {
        icon: <DashboardOutlinedIcon />,
        textLabel: "Dashboard",
        url: "dashboard",
    },
    {
        icon: <SchoolOutlinedIcon />,
        textLabel: "Academic Years",
        url: "academic_years",
    },
    {
        icon: <FeaturedPlayListOutlinedIcon />,
        textLabel: "Batches",
        url: "batches",
    },
    {
        icon: <ContactsOutlinedIcon />,
        textLabel: "Students",
        url: "students",
    },
    {
        icon: <GroupsOutlinedIcon />,
        textLabel: "Clubs",
        url: "clubs",
    },
    {
        icon: <DescriptionOutlinedIcon />,
        textLabel: "Club Proposals",
        url: "club_proposals",
    },
];

export default function SchoolAdminLayout() {
    const [desktopOpen, setDesktopOpen] = useState(true);

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));

    const { mode } = useAppTheme();

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: "site.primary"
                }}
                elevation={0}
            >
                <Container maxWidth="xl" disableGutters>
                    <Toolbar
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            columnGap: { sm: 5, lg: 20 },
                            "&.MuiToolbar-root": {
                                px: { xs: 1.5, md: 2.2 },
                            },
                        }}
                    >
                        <Link to="/school_admin/dashboard" style={{ textDecoration: "none" }}>
                            <Logo />
                        </Link>
                        <Box display="flex">
                            <ModeSwitch />
                            <AccountMenu />
                        </Box>
                    </Toolbar>
                </Container>
                <Divider />
            </AppBar >
            <Drawer
                variant="permanent"
                desktopOpen={matches && desktopOpen}
                sx={{
                    "& .MuiDrawer-paper": {
                        marginLeft: { xl: `calc(50vw - 770px)` },
                        backgroundColor: "site.secondary"
                    },
                    zIndex: 0,
                }}
            >
                <Toolbar />
                <List disablePadding>
                    {listItems.map(({ icon, textLabel, url }) => (
                        <Box
                            key={textLabel}
                            sx={{
                                "&:first-of-type": { pt: 1.5 },
                                "& a.active .MuiListItemButton-root": {
                                    backgroundColor: mode === "light" ? "secondary.light" : "secondary.dark",
                                },
                            }}
                        >
                            <NavLink to={url} style={{ textDecoration: "none" }}>
                                <ListItem sx={{ py: 0 }}>
                                    <ListItemButton
                                        sx={{
                                            pl: 3,
                                            pr: 2,
                                            ml: { xs: -1, md: 0 },
                                        }}
                                        disableRipple
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: desktopOpen ? 2 : "auto",
                                                ml: { xs: -2, sm: -1.5 },
                                            }}
                                        >
                                            {icon}
                                        </ListItemIcon>
                                        {
                                            matches && (

                                                <ListItemText
                                                    primary={textLabel}
                                                    primaryTypographyProps={{
                                                        color: "site.text",
                                                    }}
                                                />
                                            )
                                        }
                                    </ListItemButton>
                                </ListItem>
                            </NavLink>
                        </Box>
                    ))}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    pt: { xs: 1.5, sm: 2 },
                    px: { xs: 1.3, sm: 2 },
                    marginLeft: { xl: `calc(50vw - 770px)` },
                    marginRight: { xs: 2, sm: 0, xl: `calc(50vw - 770px)` },
                    width: "100%",
                    overflowX: "hidden",
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box >
    )
}