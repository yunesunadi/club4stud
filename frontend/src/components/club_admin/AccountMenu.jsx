import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { Typography } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from "../../providers/AuthProvider";
import { useAppTheme } from '../../providers/AppThemeProvider';

export default function AccountMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { setAuth, setAuthUser } = useAuth();
    const { mode } = useAppTheme();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="My Account">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "light.main" }}>
                            <Typography color="secondary" fontWeight="bold">C</Typography>
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            backgroundColor: "site.secondary",
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{
                    "& a.active .MuiButtonBase-root": {
                        backgroundColor: mode === "light" ? "secondary.light" : "secondary.dark",
                    },
                }}>
                    <NavLink to="setting" style={{ textDecoration: "none" }}>
                        <MenuItem sx={{ color: "site.text", }}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Setting
                        </MenuItem>
                    </NavLink>
                </Box>
                <MenuItem onClick={() => {
                    setAuth(false);
                    setAuthUser({});
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    navigate("/");
                }} sx={{ color: "site.text" }}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
}