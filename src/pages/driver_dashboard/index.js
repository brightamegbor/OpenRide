import { Fragment, useState, useEffect, useCallback } from "react"
import { Nav, Navbar } from "react-bootstrap"
import { signOutUser } from "../../services/firebaseUtils";
import { Redirect } from "react-router";
import LocalStorage from "../../services/localStorage";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import MailIcon from '@mui/icons-material/ContactSupportOutlined';
import MoneyIcon from '@mui/icons-material/MoneyOutlined';
import NotificationIcon from '@mui/icons-material/NotificationsOutlined'
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import TravelExploreIcon from '@mui/icons-material/TravelExploreOutlined'
import { IconButton, Stack } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import './index.css';
import Locate from "leaflet.locatecontrol"; 

const drawerWidth = 240;

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));

const DriverDashboard = (props) => {
    const [userFullName, setUserFullName] = useState("");
    const [loggedIn, setloggedIn] = useState();
    const [currentLocMap, setCurrentLocMap] = useState({ latitude: 5.55602,  longitude: - 0.1969 });

    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    async function signoutUser() {
        await signOutUser().then((result) => {
            LocalStorage.saveBool("isLoggedIn", false);
            initialize();
        })
    }

    const { map } = useMap();

    const currentLocation = useCallback(() => {
        // navigator.geolocation.getCurrentPosition(
        //     (position) => {
        //         setCurrentLocMap({
        //             longitude: position.coords.longitude,
        //             latitude: position.coords.latitude
        //         });
        //         // console.log(currentLocMap.longitude);
        //     },
        //     err => console.log(err)
        // );

        // geo locate props
        const locateOptions = {
            position: 'topright',
            maxZoom: 19,
            strings: {
                title: 'Show me where I am, yo!'
            },
            onActivate: () => { } // callback before engine starts retrieving locations
        }

        const lc = new Locate(locateOptions);
        // console.log(lc);
        lc.addTo(map);
    }, [map]);

    const initialize = useCallback(async () => {
        // const _loggedIn = await LocalStorage.getBool("isLoggedIn");
        // setloggedIn(_loggedIn);

        // const _local = await LocalStorage.getUserForm("UserDetails");
        // setUserFullName(_local.firstname + " " + _local.lastname);
        currentLocation();
    }, [currentLocation]);

    useEffect(() => {
        initialize();
    }, [initialize]);


    if (loggedIn === false) {
        return <Redirect to="/" />
    }

    const drawer = (
        <Fragment>
            <Toolbar />
            <Box sx={{ overflow: 'auto', height: '100%' }}>
                <div className="d-flex flex-column justify-content-between h-100">
                    <div>
                        <List>
                            {['Rides', 'Wallet', 'Earnings', 'Notifications'].map((text, index) => (
                                <ListItem button key={text}>
                                    <ListItemIcon>
                                        {index === 0 ? <TravelExploreIcon /> :
                                            index === 1 ? <AccountBalanceIcon /> :
                                                index === 2 ? <MoneyIcon /> : <NotificationIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
                            ))}
                        </List>
                        <Divider />
                        <List>
                            {['About us', 'Contact us'].map((text, index) => (
                                <ListItem button key={text}>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? <InfoIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
                            ))}
                        </List>
                    </div>

                    <div className="mt-auto">
                        <List>
                            {['Log out', 'Availability'].map((text, index) => (
                                <ListItem button key={text}>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? <LogoutIcon /> 
                                            : <AntSwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
                                        }
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </div>
            </Box>
        </Fragment>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Fragment>

            <Box sx={{ display: 'flex', height: '100vh' }}>
                <CssBaseline />
                <AppBar position="fixed" 
                    color="inherit"
                    elevation={1}
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h5" noWrap component="div" onClick={() => currentLocation()}>
                            Open Ride
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}>
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open>
                    {drawer}
                </Drawer>
                <Box component="main" >
                    <Toolbar className="top-toolbar" />
                    {/* body */}
                    <div className="MapWrapper" sx={{ flexGrow: 1, }}>
                        <MapContainer center={
                            currentLocMap !== undefined
                                ? [currentLocMap.latitude, currentLocMap.longitude]
                                : [5.10535, -1.2466]} zoom={14} >

                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Marker position={[5.55602, -0.1969]}>
                                <Popup>
                                    I am a pop-up!
                                </Popup>
                            </Marker>
                        </MapContainer>
                        
                    </div>
                </Box>
            </Box>
        </Fragment>
    )
}

export default DriverDashboard