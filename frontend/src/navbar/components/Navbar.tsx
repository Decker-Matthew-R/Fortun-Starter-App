import React from 'react';
import { useMetrics } from '../../metrics/client/MetricsClient';
import { METRIC_EVENT_TYPE } from '../../metrics/model/METRIC_EVENT_TYPE';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, useNavigate } from 'react-router-dom';

// interface SettingItem {
//   setting: string;
//   route?: string;
//   action?: () => void;
// }

export const Navbar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const { saveMetricEvent } = useMetrics();

    const pages = [
        { page: 'News', route: '/' },
        { page: 'Matches', route: '/' },
    ];

    // const settings: SettingItem[] = [
    //   {setting: 'Profile', route: '/profile'},
    // ];

    const navigate = useNavigate();
    const currentLocation = useLocation();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleBrandingClick = (brandingClicked: string) => {
        void saveMetricEvent(METRIC_EVENT_TYPE.BUTTON_CLICK, {
            triggerId: brandingClicked,
            screen: currentLocation.pathname,
        });
        navigate('/');
    };

    const handlePageItemClick = (route: string, buttonClicked: string) => {
        void saveMetricEvent(METRIC_EVENT_TYPE.BUTTON_CLICK, {
            triggerId: buttonClicked,
            screen: currentLocation.pathname,
        });
        navigate(route);
    };

    // const handleMenuItemClick = (item: SettingItem) => {
    //   if (item.action) {
    //     item.action();
    //   } else if (item.route) {
    //     void saveMetricEvent(METRIC_EVENT_TYPE.BUTTON_CLICK, {
    //       triggerId: item.setting,
    //       screen: currentLocation.pathname,
    //     });
    //     navigate(item.route);
    //   }
    // };

    const handleLogin = () => {
        void saveMetricEvent(METRIC_EVENT_TYPE.BUTTON_CLICK, {
            triggerId: 'Login',
            screen: currentLocation.pathname,
        });
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <AppBar position='static'>
            <Container maxWidth={false}>
                <Toolbar disableGutters>
                    <AdbIcon
                        aria-label='atlas-logo'
                        onClick={() => handleBrandingClick('Atlas Logo')}
                        sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, cursor: 'pointer' }}
                    />
                    <Typography
                        aria-label={'atlas-site-name'}
                        onClick={() => handleBrandingClick('Atlas Name')}
                        variant='h6'
                        noWrap
                        component='a'
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        FORTUNA
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size='large'
                            aria-label='navigation-links'
                            aria-controls='menu-appbar'
                            aria-haspopup='true'
                            onClick={handleOpenNavMenu}
                            color='inherit'
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id='menu-appbar'
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    key={page.page}
                                    onClick={() => {
                                        handleCloseNavMenu();
                                        handlePageItemClick(page.route, page.page);
                                    }}
                                >
                                    <Typography sx={{ textAlign: 'center' }}>
                                        {page.page}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon
                        aria-label={'atlas-logo-mobile'}
                        onClick={() => handleBrandingClick('Atlas Logo')}
                        sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, cursor: 'pointer' }}
                    />
                    <Typography
                        aria-label={'atlas-site-name-mobile'}
                        onClick={() => handleBrandingClick('Atlas Name')}
                        variant='h5'
                        noWrap
                        component='a'
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        ATLAS
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.page}
                                onClick={() => {
                                    handleCloseNavMenu();
                                    handlePageItemClick(page.route, page.page);
                                }}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.page}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title='Open Profile Settings'>
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <Avatar alt={''}></Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id='menu-appbar'
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <Button
                                onClick={handleLogin}
                                sx={{ marginLeft: '.4rem', marginRight: '.4rem' }}
                            >
                                Login
                            </Button>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
