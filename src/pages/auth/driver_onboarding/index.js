import React, { Component, Fragment } from 'react'
import ApartmentIcon from '@material-ui/icons/Apartment';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import SettingsIcon from '@material-ui/icons/Settings';
import PhotoIcon from '@material-ui/icons/Photo';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import './index.css';
import { Form, InputGroup } from 'react-bootstrap';
import { TextField, Input } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';

const QontoConnector = withStyles({
    alternativeLabel: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    active: {
        '& $line': {
            borderColor: '#784af4',
        },
    },
    completed: {
        '& $line': {
            borderColor: '#784af4',
        },
    },
    line: {
        borderColor: '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
    root: {
        color: '#eaeaf0',
        display: 'flex',
        height: 22,
        alignItems: 'center',
    },
    active: {
        color: '#784af4',
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
    completed: {
        color: '#784af4',
        zIndex: 1,
        fontSize: 18,
    },
});

function QontoStepIcon(props) {
    const classes = useQontoStepIconStyles();
    const { active, completed } = props;

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
            })}
        >
            {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
        </div>
    );
}

QontoStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
};

const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 22,
    },
    active: {
        '& $line': {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    completed: {
        '& $line': {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1,
    },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
    root: {
        backgroundColor: '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    active: {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
    completed: {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    },
});

function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    const icons = {
        1: <ApartmentIcon />,
        2: <SettingsIcon />,
        3: <PhotoIcon />,
    };

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed,
            })}
        >
            {icons[String(props.icon)]}
        </div>
    );
}

ColorlibStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
    icon: PropTypes.node,
};

const useStyles = makeStyles((theme) => ({
    toggleContainer: {
        margin: theme.spacing(2, 2),
    },

    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return ['Property Type', 'Property Details', 'Upload Photos'];
}

function StepContent0() {
    const classes = useStyles();
    const [propertyType, setPropertyType] = React.useState('');

    const handlePropertyType = (event, newPropertyType) => {
        if (newPropertyType) {
            setPropertyType(newPropertyType);
        }
    };


    const [apartmentType, setApartmentType] = React.useState('apartment');

    const handleApartmentType = (event, newApartmentType) => {
        if (newApartmentType.length !== 0) {
            setApartmentType(newApartmentType);
        }
    };

    const [houseType, setHouseType] = React.useState('house');

    const handleHouseType = (event, newHouseType) => {
        if (newHouseType.length) {
            setHouseType(newHouseType);
        }
    };

    const [roomType, setRoomType] = React.useState('single-room');

    const handleRoomType = (event, newRoomType) => {
        if (newRoomType.length) {
            setRoomType(newRoomType);
        }
    };


    return (
        <div className="container">
            Select your property category that best match
            <Form className="mb-4 pb-4">
                <Grid container>
                    <div className={classes.toggleContainer}>
                        <ToggleButtonGroup
                            value={propertyType}
                            exclusive
                            onChange={handlePropertyType}
                            aria-label="text propertType"
                            className="propTypebtn">
                            <ToggleButton
                                value="apartment"
                                aria-label="apartment"
                                className="">
                                Apartment
                            </ToggleButton>

                            <ToggleButton
                                value="house"
                                aria-label="house"
                                className=" border-left">
                                House
                            </ToggleButton>

                            <ToggleButton
                                value="room"
                                aria-label="room"
                                className=" border-left">
                                Room
                            </ToggleButton>
                        </ToggleButtonGroup>

                    </div>

                </Grid>

                <Grid>
                    <p className="mt-4">
                        Apartment Type
                    </p>
                    <div className={classes.toggleContainer}>
                        <ToggleButtonGroup
                            value={apartmentType}
                            exclusive
                            onChange={handleApartmentType}
                            aria-label="text propertType"
                            className="propTypebtn propSubTypebtn">
                            <ToggleButton
                                value="apartment"
                                aria-label="apartment"
                                className="">
                                Apartment
                            </ToggleButton>

                            <ToggleButton
                                value="studio"
                                aria-label="studio"
                                className=" border-left">
                                Studio
                            </ToggleButton>

                            <ToggleButton
                                value="bachelor"
                                aria-label="bachelor"
                                className=" border-left">
                                Bachelor
                            </ToggleButton>

                            <ToggleButton
                                value="basement"
                                aria-label="basement"
                                className=" border-left">
                                Basement
                            </ToggleButton>

                            <ToggleButton
                                value="duplex"
                                aria-label="duplex"
                                className=" border-left">
                                Duplex
                            </ToggleButton>

                            <ToggleButton
                                value="loft"
                                aria-label="loft"
                                className=" border-left">
                                Loft
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>


                </Grid>

                <Grid>
                    <p className="mt-4">
                        House Type
                    </p>
                    <div className={classes.toggleContainer}>
                        <ToggleButtonGroup
                            value={houseType}
                            exclusive
                            onChange={handleHouseType}
                            aria-label="text propertType"
                            className="propTypebtn propSubTypebtn">
                            <ToggleButton
                                value="house"
                                aria-label="house"
                                className="">
                                House
                            </ToggleButton>

                            <ToggleButton
                                value="cottage"
                                aria-label="cottage"
                                className=" border-left">
                                Cottage
                            </ToggleButton>

                            <ToggleButton
                                value="multi-unit"
                                aria-label="multi-unit"
                                className=" border-left">
                                Multi-Unit
                            </ToggleButton>


                        </ToggleButtonGroup>
                    </div>


                </Grid>


                <Grid>
                    <p className="mt-4">
                        Room Type
                    </p>
                    <div className={classes.toggleContainer}>
                        <ToggleButtonGroup
                            value={roomType}
                            exclusive
                            onChange={handleRoomType}
                            aria-label="text propertType"
                            className="propTypebtn propSubTypebtn">
                            <ToggleButton
                                value="single-room"
                                aria-label="single-room"
                                className="">
                                Single Room
                            </ToggleButton>

                            <ToggleButton
                                value="single-room-self-contain"
                                aria-label="single-room-self-contain"
                                className=" border-left">
                                Single Room Self Contain
                            </ToggleButton>

                            <ToggleButton
                                value="single-room-porch"
                                aria-label="single-room-porch"
                                className=" border-left">
                                Single Room (Porch)
                            </ToggleButton>

                            <ToggleButton
                                value="chamber-hall"
                                aria-label="chamber-hall"
                                className=" border-left">
                                Chamber & Hall
                            </ToggleButton>


                        </ToggleButtonGroup>
                    </div>


                </Grid>

                <Grid className="mt-4 pt-4">
                    <p className="mt-3 font-weight-bold">
                        Property Location
                    </p>


                    <TextField style={{ width: "100%" }}
                        label="Address*"
                        id="input-with-icon-textfield"
                        variant="outlined" />

                    <div className="row mt-3">
                        <div className="col-6">
                            <TextField style={{ width: "100%" }}
                                label="Unit*"
                                id="input-with-icon-textfield"
                                variant="outlined" />

                        </div>

                        <div className="col-6">
                            <TextField style={{ width: "100%" }}
                                label="Landmark*"
                                id="input-with-icon-textfield"
                                variant="outlined" />

                        </div>
                    </div>


                </Grid>
            </Form>
        </div>
    )
}

function StepContent1() {
    const classes = useStyles();
    const [propertyType, setPropertyType] = React.useState('');

    const handlePropertyType = (event, newPropertyType) => {
        if (newPropertyType) {
            setPropertyType(newPropertyType);
        }
    };


    const [apartmentType, setApartmentType] = React.useState('apartment');

    const handleApartmentType = (event, newApartmentType) => {
        if (newApartmentType.length) {
            setApartmentType(newApartmentType);
        }
    };

    const [houseType, setHouseType] = React.useState('house');

    const handleHouseType = (event, newHouseType) => {
        if (newHouseType.length) {
            setHouseType(newHouseType);
        }
    };

    const [roomType, setRoomType] = React.useState('single-room');

    const handleRoomType = (event, newRoomType) => {
        if (newRoomType.length) {
            setRoomType(newRoomType);
        }
    };


    return (
        <div className="container">
            <Form className="mb-4 pb-4">
                <p>Provide important information about your listing</p>

                <p className="pt-5">Utilities Available</p>
                <Grid container>
                    <div className={classes.toggleContainer}>
                        <ToggleButtonGroup
                            value={propertyType}
                            exclusive
                            onChange={handlePropertyType}
                            aria-label="text propertType"
                            className="propTypebtn">
                            <ToggleButton
                                value="water"
                                aria-label="water"
                                className="">
                                Water
                            </ToggleButton>

                            <ToggleButton
                                value="electricity"
                                aria-label="electricity"
                                className=" border-left">
                                Electricity
                            </ToggleButton>

                            <ToggleButton
                                value="internet"
                                aria-label="internet"
                                className=" border-left">
                                Internet/WiFi
                            </ToggleButton>


                            <ToggleButton
                                value="tv"
                                aria-label="tv"
                                className=" border-left">
                                TV
                            </ToggleButton>
                        </ToggleButtonGroup>

                    </div>

                </Grid>

                <Grid>
                    <p className="mt-4">
                        Furnished?
                    </p>
                    <div className={classes.toggleContainer}>
                        <ToggleButtonGroup
                            value={apartmentType}
                            exclusive
                            onChange={handleApartmentType}
                            aria-label="text propertType"
                            className="propTypebtn propSubTypebtn">
                            <ToggleButton
                                value="yes"
                                aria-label="yes"
                                className="">
                                Yes
                            </ToggleButton>

                            <ToggleButton
                                value="no"
                                aria-label="no"
                                className=" border-left">
                                No
                            </ToggleButton>


                        </ToggleButtonGroup>
                    </div>


                </Grid>

                <Grid>
                    <p className="mt-4">
                        Lease Term
                    </p>
                    <div className={classes.toggleContainer}>
                        <ToggleButtonGroup
                            value={houseType}
                            exclusive
                            onChange={handleHouseType}
                            aria-label="text propertType"
                            className="propTypebtn propSubTypebtn">
                            <ToggleButton
                                value="one-year"
                                aria-label="one-year"
                                className="">
                                1 Year
                            </ToggleButton>

                            <ToggleButton
                                value="monthly"
                                aria-label="monthly"
                                className=" border-left">
                                Monthly
                            </ToggleButton>

                            <ToggleButton
                                value="negotiable"
                                aria-label="negotiable"
                                className=" border-left">
                                Negotiable
                            </ToggleButton>


                        </ToggleButtonGroup>
                    </div>


                </Grid>


                <Grid>
                    <p className="mt-4">
                        Other Details
                    </p>
                    <div className={classes.toggleContainer}>
                        <ToggleButtonGroup
                            value={roomType}
                            exclusive
                            onChange={handleRoomType}
                            aria-label="text propertType"
                            className="propTypebtn propSubTypebtn">
                            <ToggleButton
                                value="bathroom"
                                aria-label="bathroom"
                                className="">
                                Bathroom
                            </ToggleButton>

                            <ToggleButton
                                value="kitchen"
                                aria-label="kitchen"
                                className=" border-left">
                                Kitchen
                            </ToggleButton>

                            <ToggleButton
                                value="toilet"
                                aria-label="toilet"
                                className=" border-left">
                                Toilet
                            </ToggleButton>

                        </ToggleButtonGroup>
                    </div>


                </Grid>

                <Grid>
                    <p className="mt-4">
                        Bathroom Type
                    </p>
                    <div className={classes.toggleContainer}>
                        <ToggleButtonGroup
                            value={roomType}
                            exclusive
                            onChange={handleRoomType}
                            aria-label="text propertType"
                            className="propTypebtn propSubTypebtn">
                            <ToggleButton
                                value="in-built"
                                aria-label="in-built"
                                className="">
                                In Built
                            </ToggleButton>

                            <ToggleButton
                                value="outside"
                                aria-label="outside"
                                className=" border-left">
                                Outside
                            </ToggleButton>

                        </ToggleButtonGroup>
                    </div>


                </Grid>

            </Form>
        </div>
    )
}

function StepContent2() {
    const classes = useStyles();
    const [propertyType, setPropertyType] = React.useState('');

    const handlePropertyType = (event, newPropertyType) => {
        if (newPropertyType) {
            setPropertyType(newPropertyType);
        }
    };


    const [apartmentType, setApartmentType] = React.useState('apartment');

    const handleApartmentType = (event, newApartmentType) => {
        if (newApartmentType.length) {
            setApartmentType(newApartmentType);
        }
    };

    const [houseType, setHouseType] = React.useState('house');

    const handleHouseType = (event, newHouseType) => {
        if (newHouseType.length) {
            setHouseType(newHouseType);
        }
    };

    const [roomType, setRoomType] = React.useState('single-room');

    const handleRoomType = (event, newRoomType) => {
        if (newRoomType.length) {
            setRoomType(newRoomType);
        }
    };


    const handlecapture = ({ target }) => {
        const fileReader = new FileReader();
        const name = target.accept.includes('image') ? 'images' : '';

        fileReader.readAsDataURL(target.files[0]);
        fileReader.onload = (e) => {
            this.setState((prevState) => ({
                [name]: [...prevState[name], e.target.result]
            }));
        };
    };


    return (
        <div className="container">
            <Form className="mb-4 pb-4">
                <p>Upload at least 3 high resolution images
                    in JPG or PNG format
                </p>

                <div>
                    <Fragment>
                        <Button
                            variant="contained"
                            className="custom-upload-btn"
                            size="large"
                        >

                            <label htmlFor="icon-button-file">
                                <input
                                    color="primary"
                                    accept="image/*"
                                    type="file"
                                    id="icon-button-file"
                                    style={{ display: 'none' }}
                                />

                                <ImageIcon className="custom-upload-icon" />
                                Add Photos

                            </label>
                        </Button>
                    </Fragment>
                </div>

                <div className="pt-5">
                    <p>Description</p>
                    <TextField
                        style={{ width: "420px" }}
                        id="outlined-multiple-static"
                        label="Description"
                        multiline
                        rows="6"
                        variant="outlined"
                    />
                </div>

                <div className="pt-5">
                    <p>Additional Features</p>
                    <TextField
                        style={{ width: "420px" }}
                        id="outlined-multiple-static"
                        label=""
                        multiline
                        rows="6"
                        variant="outlined"
                    />
                </div>



            </Form>
        </div>
    )
}


function getStepContent(step) {

    switch (step) {
        case 0:
            return <StepContent0 />;
        case 1:
            return <StepContent1 />;
        case 2:
            return <StepContent2 />;
        default:
            return 'Unknown step';
    }
}

function CustomizedSteppers() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <div className={classes.root}>
            {/* <Stepper alternativeLabel activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper> */}

            {/* <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper> */}

            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div className="container">
                {activeStep === steps.length ? (
                    <div>
                        <Button onClick={handleReset} className={classes.button}>
                            Reset
                        </Button>
                    </div>
                ) : (
                    <div>
                        <div className={classes.instructions}>{getStepContent(activeStep)}</div>
                        <div className="custom-ml-auto">
                            <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                className={classes.button}
                            >
                                {activeStep === steps.length - 1 ? 'Publish' : 'Next'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}



// class addProperty extends Component {

//     render() {
//         return (
//             <CustomizedSteppers />

//         );
//     }
// }

const DriverOnboarding = () => {
    return(
        <CustomizedSteppers />
    )
}

export default DriverOnboarding;
