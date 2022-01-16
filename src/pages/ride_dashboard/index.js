/* eslint-disable react/prop-types */
import React, { Fragment, useState, useEffect, useCallback, useContext } from "react"
// import { Nav, Navbar } from "react-bootstrap"
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
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import TravelExploreIcon from '@mui/icons-material/TravelExploreOutlined'
import { IconButton, InputAdornment } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
// import Switch from '@mui/material/Switch';
import { styled, useTheme } from '@mui/material/styles';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CarRentalIcon from '@mui/icons-material/CarRental';
import WorkIcon from '@mui/icons-material/WorkOutline';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import './index.css';
// import Locate from "leaflet.locatecontrol";
import L from 'leaflet';
import MyLocationIcon from '../../assets/icons/my_location_icon.svg';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { grey } from '@mui/material/colors';
import { Global } from '@emotion/react';
import { getAuth } from "firebase/auth";
// import { useHistory, } from "react-router-dom";
import TextField from '@mui/material/TextField'; 
import AddressPickerForm from '../../components/address_picker';
import Context from "../../Context";
import RideDetail from "../../components/ride_details";
import CircularProgress from '@material-ui/core/CircularProgress';


require("leaflet-routing-machine");

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBarLarge = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerLarge = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

// ride request mobile mixins
const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
    height: '100%',
    backgroundColor:
        theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
}));

// --end

// const AntSwitch = styled(Switch)(({ theme }) => ({
//     width: 28,
//     height: 16,
//     padding: 0,
//     display: 'flex',
//     '&:active': {
//         '& .MuiSwitch-thumb': {
//             width: 15,
//         },
//         '& .MuiSwitch-switchBase.Mui-checked': {
//             transform: 'translateX(9px)',
//         },
//     },
//     '& .MuiSwitch-switchBase': {
//         padding: 2,
//         '&.Mui-checked': {
//             transform: 'translateX(12px)',
//             color: '#fff',
//             '& + .MuiSwitch-track': {
//                 opacity: 1,
//                 backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
//             },
//         },
//     },
//     '& .MuiSwitch-thumb': {
//         boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
//         width: 12,
//         height: 12,
//         borderRadius: 6,
//         transition: theme.transitions.create(['width'], {
//             duration: 200,
//         }),
//     },
//     '& .MuiSwitch-track': {
//         borderRadius: 16 / 2,
//         opacity: 1,
//         backgroundColor:
//             theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
//         boxSizing: 'border-box',
//     },
// }));

function LocationMarker() {
    const [position, setPosition] = useState(null);
    const [bbox, setBbox] = useState([]);

    const map = useMap();
    const { routeControl, setPrice, setDistance } = useContext(Context);

    const initRouteControl = () => {
        routeControl.current = L.Routing.control({
          show: false,
          collapseBtn: false,
          collapsible: false,
          fitSelectedRoutes: true,
          plan: false,
          lineOptions: {
            styles: [
              {
                color: "blue",
                opacity: "0.7",
                weight: 6
              }
            ]
          },
          router: L.Routing.mapbox(`${process.env.REACT_APP_MAPBOX_ACCESSTOKEN}`),
        })
        .on('routeselected', function(e) {
            var routes = e.route;
            var summary = routes.summary;
            var time = Math.round(summary.totalTime % 3600 / 60);
            // alert distance and time in km and minutes
            // console.log('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + time + ' minutes');
            // console.log("your price is: " + time * 0.55);
            setPrice(Math.round(time * 0.55))
            setDistance(Math.round(summary.totalDistance / 1000).toString() + ' km')
         })
        .addTo(map)
        .getPlan();  
      };

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom(),);
            const radius = e.accuracy;
            const circle = L.circle(e.latlng, radius,
                { fillOpacity: 0.1, stroke: false, radius: 15 });
            circle.addTo(map);
            setBbox(e.bounds.toBBoxString().split(","));
        });

        initRouteControl();
    }, [map]);

    return position === null ? null : (
        <Marker position={position} icon={L.icon({
            iconUrl: MyLocationIcon,
            className: 'blinking'
        })}>
            <Popup>
                My location <br />
                Map bbox: <br />
                <b>Southwest lng</b>: {bbox[0]} <br />
                <b>Southwest lat</b>: {bbox[1]} <br />
                <b>Northeast lng</b>: {bbox[2]} <br />
                <b>Northeast lat</b>: {bbox[3]}
            </Popup>
        </Marker>
    );
}


const RideDashboard = (props) => {
    // const [userFullName, setUserFullName] = useState("");
    const [loggedIn, setloggedIn] = useState();
    // const [currentLocMap, setCurrentLocMap] = useState({ latitude: 0, longitude: 0 });

    // eslint-disable-next-line no-unused-vars
    const { selectedFrom, selectedTo, currentRide, isLoading, 
        whereToHeight, setwhereToHeight, user, routeControl } = useContext(Context);

    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const themelg = useTheme();
    const [open, setOpen] = useState(false);

    // const map = useRef();

    
    // let history = useHistory();
    
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    
    const handleDrawerOpenClose = () => {
        setOpen(!open);
    };
    
    // ride request drawer mobile
    const [openRequest, setOpenRequest] = useState(true);
    
    const toggleDrawer = (newOpen) => () => {
        setOpenRequest(newOpen);
    };
    
    // const [whereToHeight, setwhereToHeight] = useState(40);
    // eslint-disable-next-line no-unused-vars
    const [showRides, setShowRides] = useState(false);
    
    async function signoutUser() {
        await signOutUser().then((result) => {
            console.log(result);
            LocalStorage.saveBool("isLoggedIn", false);
            initialize();
        })
    }

    const initialize = useCallback(async () => {
        const _loggedIn = await LocalStorage.getBool("isLoggedIn");
        setloggedIn(_loggedIn);

        var user = getAuth().currentUser;

        if(user == null) {
            return <Redirect to="/ride" />;
        }

        // const _local = await LocalStorage.getUserForm("UserDetails");
        // setUserFullName(_local.firstname + " " + _local.lastname);
        // currentLocation();
    }, []);

    useEffect(() => {
        initialize();
        // initRouteControl();
    }, []);

    const drawRoute = useCallback((from, to) => {
        if (shouldRouteDrawed(from, to) && routeControl && routeControl.current) {
          const fromLatLng = new L.LatLng(from.y, from.x);
          const toLatLng = new L.LatLng(to.y, to.x);
          routeControl.current.setWaypoints([fromLatLng, toLatLng]);

          console.log(L.latLng(fromLatLng).distanceTo(toLatLng));

          routeControl.current.on('routeselected', function(e) {
            var routes = e.routes;
            var summary = routes[0].summary;
            // alert distance and time in km and minutes
            alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
         });
        }
      }, []);

    useEffect(() => {
        if (shouldRouteDrawed(selectedFrom, selectedTo)) {
          drawRoute(selectedFrom, selectedTo);
        }
      }, [selectedFrom, selectedTo, drawRoute]);

    /**
   * check if a route should be drawed.
   * @param {*} selectedFrom 
   * @param {*} selectedTo 
   */
    const shouldRouteDrawed = (selectedFrom, selectedTo) => {
        return selectedFrom && selectedTo && selectedFrom.label &&
        selectedTo.label && selectedFrom.x && selectedTo.x &&
        selectedFrom.y && selectedTo.y;   
      };

    // const initRouteControl = () => {
    //     routeControl.current = L.Routing.control({
    //       show: true,
    //       fitSelectedRoutes: true,
    //       plan: false,
    //       lineOptions: {
    //         styles: [
    //           {
    //             color: "blue",
    //             opacity: "0.7",
    //             weight: 6
    //           }
    //         ]
    //       },
    //       router: L.Routing.mapbox(`${process.env.REACT_APP_MAPBOX_ACCESSTOKEN}`)
    //     })
    //       .addTo(map.current)
    //       .getPlan();  
    //   };


    if (loggedIn === false) {
        return <Redirect to="/ride" />
    }

    const drawer = (
        <Fragment>
            {/* <Toolbar /> */}
            <Box sx={{ overflow: 'hidden', height: '100%' }}>
                <div className="d-flex flex-column justify-content-between h-100">
                    <div>
                        <List>
                            {['Ride History', 'Promotions', 'Payment', 'Work Rides'].map((text, index) => (
                                <ListItem button key={text}>
                                    <ListItemIcon>
                                        {index === 0 ? <TravelExploreIcon /> :
                                            index === 1 ? <AccountBalanceIcon /> :
                                                index === 2 ? <MoneyIcon /> : <WorkIcon />}
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
                            {['Log out', 'Become a driver'].map((text, index) => (
                                <ListItem button key={text} onClick={text === "Log out" ? signoutUser : null}>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? <LogoutIcon />
                                            : <CarRentalIcon />
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

    const renderSwipeContent = () => {
        const isUser = user && user.userType === 'rider';

        if(!isLoading && whereToHeight === 40 && !currentRide) {
            return <TextField
            fullWidth
            className="pt-ss3"
            // {...params}
            // label="Search destination"
            placeholder="Where to?"
            variant="filled"
            InputProps={{
                // ...params.InputProps,
                // type: 'search',
                startAdornment: 
                    <InputAdornment position="start"><SearchOutlinedIcon /></InputAdornment>,
            }}
        // onChange={(e) => fetchAddrSuggestions(e, { inputName: "dest" })}
        // ref={destinationRef}
            value={selectedTo ? selectedTo.label : ""}
            onClick={() => setwhereToHeight(100)}
        />
        }
        if (isUser && !currentRide && whereToHeight === 100) {
            return <AddressPickerForm heightCallback={() => setwhereToHeight(40)}  />
        } 
        if (isUser && currentRide) {
            setwhereToHeight(60)
        return <RideDetail user={currentRide.driver} isDriver={false} currentRide={currentRide} />
        }
    }

    return (
        <Fragment>

            <Box sx={{ display: 'flex', height: '100vh' }}>
                <CssBaseline />
                <AppBar position="fixed"
                    color="inherit"
                    elevation={1}
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 2,
                        display: { sm: 'none' }
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            // display: {sm: 'none' }
                            sx={{ mr: 2, display: { sm: 'none' } }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h5" noWrap component="div">
                            Open Ride
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* appbar desktop */}
                <AppBarLarge position="fixed"
                    elevation={1}
                    color="inherit"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                    open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpenClose}
                            edge="start"
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Open Ride
                        </Typography>
                    </Toolbar>
                </AppBarLarge>

                {/* // drawer mobile */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}>
                    <Toolbar />
                    {drawer}
                </Drawer>

                {/* drawer desktop */}
                <DrawerLarge
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        // '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open={open}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerOpenClose}>
                            {themelg.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    {drawer}
                </DrawerLarge>

                <Box component="main" >
                    <Toolbar className="top-toolbar" />
                    {/* body */}
                    <div className="MapWrapper" sx={{ flexGrow: 1, }}>
                        <MapContainer zoomControl={false} center={
                            [5.10535, -1.2466]} zoom={14} >

                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <LocationMarker />
                        </MapContainer>

                    </div>

                    <Root sx={{
                        display: { xs: 'block', sm: 'none' }
                    }}>
                        <Global
                            styles={{
                                '.MuiSwipeDrawer > .MuiPaper-root': {
                                    height: `calc(${whereToHeight}% - ${drawerBleeding}px)`,
                                    overflow: 'visible',
                                },
                            }}
                            sx={{
                                display: { xs: 'block', sm: 'none' }
                            }}
                        />

                        <SwipeableDrawer
                            container={container}
                            anchor="bottom"
                            open={openRequest}
                            onClose={toggleDrawer(false)}
                            onOpen={toggleDrawer(true)}
                            swipeAreaWidth={drawerBleeding}
                            disableSwipeToOpen={false}
                            variant={"persistent"}
                            BackdropProps={{ invisible: true }}
                            ModalProps={{
                                keepMounted: true,
                            }}
                            className="MuiSwipeDrawer"
                            sx={{
                                display: { xs: 'block', sm: 'none' }
                            }}
                        >
                            <StyledBox
                                sx={{
                                    position: 'absolute',
                                    top: -whereToHeight,
                                    borderTopLeftRadius: 8,
                                    borderTopRightRadius: 8,
                                    visibility: 'visible',
                                    right: 0,
                                    left: 0,
                                    display: { xs: 'block', sm: 'none' }
                                }}
                            >
                                <Puller sx={{
                                    display: { xs: 'block', sm: 'none' }
                                }} />
                                <Typography sx={{ p: 3.8, color: 'text.secondary', display: { xs: 'block', sm: 'none' } }}></Typography>
                            </StyledBox>
                            <StyledBox
                                sx={{
                                    px: 2,
                                    pb: 2,
                                    height: '100%',
                                    overflow: 'auto',
                                    width: '100%',
                                    display: { xs: 'block', sm: 'none' }
                                }}
                            >
                                {/* <Skeleton sx={{
                                display: { xs: 'block', sm: 'none' }
                            }} variant="rectangular" height="50%" /> */}

                            {/* form starts here */}
                                {/* {whereToHeight === 40 && 
                                    <div className="d-flex w-100">
                                        {!showRides ? 
                                            <TextField
                                                fullWidth
                                                className="pt-ss3"
                                                // {...params}
                                                // label="Search destination"
                                                placeholder="Where to?"
                                                variant="filled"
                                                InputProps={{
                                                    // ...params.InputProps,
                                                    // type: 'search',
                                                    startAdornment: 
                                                        <InputAdornment position="start"><SearchOutlinedIcon /></InputAdornment>,
                                                }}
                                            // onChange={(e) => fetchAddrSuggestions(e, { inputName: "dest" })}
                                            // ref={destinationRef}
                                                onClick={() => setwhereToHeight(100)}
                                            />
                                            : <div></div>
                                        }
                                    </div>
                                } */}

                                {/* {whereToHeight === 100 && */}
                                {/* className={whereToHeight === 100 ? "d-block" : "d-none"} */}
                                <div >
                                    {renderSwipeContent()}
                                </div>

                                
                                <div className="d-flex justify-content-center mt-4">{isLoading && <CircularProgress />}</div>
                                {/* // } */}

                                {/* <Form.Group className="mb-3">
                                    <InputGroup>
                                        <span className="country-prefix"><MyLocationOutlinedIcon /></span>
                                        <Form.Control className="phone-field" type="text" placeholder="Search pick-up location" />
                                    </InputGroup>
                                </Form.Group> */}

                                {/* <Form.Group className="mb-3">
                                    <InputGroup>
                                        <span className="country-prefix"><LocationOnOutlinedIcon /></span>
                                        <Form.Control className="phone-field" type="text" placeholder="Search destination" />
                                    </InputGroup>
                                </Form.Group> */}
                            </StyledBox>
                        </SwipeableDrawer>
                    </Root>
                </Box>
            </Box>
        </Fragment>
    )
}

export default RideDashboard