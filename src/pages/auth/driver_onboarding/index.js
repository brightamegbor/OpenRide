/* eslint-disable react/prop-types */
import React, { Fragment, useState, 
    useEffect, useRef } from "react";
import { 
    Button, 
    Col, Form, 
    Nav, Navbar, Row,
    Image,
    InputGroup
} from "react-bootstrap";
import "./index.css";
// import {
//     MdRemoveRedEye
// } from "react-icons/md";
// import {
//     FaEyeSlash
// } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import LocalStorage from "../../../services/localStorage";
import * as uuid from 'uuid';
import { Redirect } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
// import Box from '@material-ui/core/Box';
import { uploadImageToStorage, signOutUser } from "../../../services/firebaseUtils";
import firebaseCRUDService from "../../../services/firebaseUtils";
import Slide from '@material-ui/core/Slide';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import imageUploadGlobal from '../../../assets/images/profile_photo_upload.png';
import { getDownloadURL } from "firebase/storage";
import Select from 'react-select';
import manufacturers from './cars_manufacturers.json';
import carModels from './cars_models.json';
import carColors from './car_colors.json';
import licenseFrontImage from '../../../assets/images/ghana_drivers_license-ghana.png';
import licenseBackImage from '../../../assets/images/reverse_side_of_ghana_drivers_license-ghana.png';
import insuranceStickerImage from '../../../assets/images/proof_of_insurance-ghana.png';
import roadWorthStickerImage from '../../../assets/images/roadworthiness_sticker_from_the_dvla-ghana.png';
import LinearProgress from '@material-ui/core/LinearProgress';
import { styled } from '@material-ui/core/styles';

/// validation
const schema = yup.object({
    firstname: yup.string().required("This field is required"),
    lastname: yup.string().required("This field is required"),
    manufacturer: yup.string().required("This field is required"),
    vehicleYear: yup.string().required("This field is required"),
    licensePlate: yup.string().required("This field is required"),
    carColor: yup.string().required("This field is required"),
    // password: yup.string().required("This field is required"),

}).required();

/// validation 2
const vehicleInfoSchema = yup.object({
    vehicleManufacturer: yup.string().required("This field is required"),
    vehicleModel: yup.string().required("This field is required"),
    vehicleYear: yup.string().required("This field is required"),
    licensePlate: yup.string().required("This field is required"),
    carColor: yup.string().required("This field is required"),

}).required();

/// validation 3
// const vehicleDocsSchema = yup.object({
//     vehicleManufacturer: yup.string().required("This field is required"),
//     vehicleModel: yup.string().required("This field is required"),
//     vehicleYear: yup.string().required("This field is required"),
//     licensePlate: yup.string().required("This field is required"),
//     carColor: yup.string().required("This field is required"),

// }).required();


function UploadPhotoModal(props) {
    return (
        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.close}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Upload your profile photo"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="upload-description-note" className="fw-bold">
                    Your profile photo helps people recognise you. Please note that once 
                    you have submitted your profile photo, it cannot be changed.
                </DialogContentText>

                <DialogContentText id="upload-description-note">
                    1. Face the camera and make sure your eyes and mouth are clearly visible <br />
                    2. Make sure the photo is well lit, free of glare and in focus <br />
                    3. No photos of a photo, filters or alterations
                </DialogContentText>

                <div className="text-center">
                    <Image width="250" height="250" 
                    alt="upload_global_img" src={imageUploadGlobal} />

                </div>
                <div className="text-center mt-4 pt-2 position-relative">
                    <input type="file" accept="image/*" capture="camera" 
                        className="upload-image-btn position-absolute opacity-0"
                        onChange={(e) => { 
                            props.setPhoto(e.target.files[0]);
                            props.close()
                        }} />

                    <Button variant="dark" className="upload-image-btn">Upload image </Button>
                </div>    
            </DialogContent>
            <DialogActions>
                <Button variant="danger" onClick={props.close}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

function UploadDocsPhotoModal(props) {
    return (
        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.close}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="upload-description-note">
                    {props.content}
                </DialogContentText>

                <div className="text-center">
                    <Image width="329" height="199" 
                    alt={props.imageExample} src={props.imageExample} />

                </div>
                <div className="text-center mt-4 pt-2 position-relative">
                    <input type="file" accept="image/*" capture="camera" 
                        className="upload-image-btn position-absolute opacity-0"
                        onChange={(e) => { 
                            // await props.setPhoto(e.target.files[0]);
                            props.close.call();
                            props.upload(e.target.files[0]);
                        }} />

                    <Button variant="dark" className="upload-image-btn">Upload image </Button>
                </div>    
            </DialogContent>
            <DialogActions>
                <Button variant="danger" onClick={props.close}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 3,
    [`&.${LinearProgress.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${LinearProgress.bar}`]: {
        borderRadius: 3,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));

const DriverOnboarding = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    
    const { handleSubmit: submitVehicleInfo, control, formState: { errors: vehInfoErrors } } = useForm({
        resolver: yupResolver(vehicleInfoSchema)
    });
    
    // eslint-disable-next-line no-unused-vars
    const { register: docsInfo, handleSubmit: submitDocsInfo, formState: { errors: docsInfoErrors } } = useForm({
        resolver: yupResolver(schema)
    });
    
    // let history = useHistory();

    const [errorMessage, setErrorMessage] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [loggedIn, setloggedIn] = useState();
    const [showUploadModal, setShowUploadModal] = React.useState(false);
    
    const [driverPhoto, setDriverPhoto] = useState('');
    const [imgProgress, setImgProgress] = useState(0);
    
    const [isPersonalDone, setIsPersonalDone] = useState();
    const [isDriversInfoDone, setIsDriversInfoDone] = useState();
    
    // const [carManufacturer, setCarManufacturer] = useState('');
    // const [carYear, setCarYear] = useState(2021);
    // const [carColor, setCarColor] = useState('');
    
    const [carModells, setCarModels] = useState([]);
    
    
    const year = (new Date()).getFullYear();
    // const years = useRef(["2021", "2020", "2019"]);
    const years = useRef(Array.from(new Array(21), (val, index) => year - index));
    
    const [licensePhotoFront, setLicensePhotoFront] = useState('');
    const [showLicenseFrontUploadModal, setLicenseFrontUploadModal] = React.useState(false);
    
    const [licensePhotoBack, setLicensePhotoBack] = useState('');
    const [showLicenseBackUploadModal, setLicenseBackUploadModal] = React.useState(false);
    
    const [insuranceStickerPhoto, setInsuranceStickerPhoto] = useState('');
    const [showInsuranceStickerUploadModal, setInsuranceStickerUploadModal] = React.useState(false);
    
    
    const [roadWorthStickerPhoto, setRoadWorthStickerPhoto] = useState('');
    const [showRoadWorthStickerUploadModal, setRoadWorthStickerUploadModal] = React.useState(false);
    
    const [licenseFrontProgress, setLicenseFrontProgress] = useState(0);
    const [islicenseFrontLoading, setIsLicenseFrontLoading] = useState(false);
    
    const [licenseBackProgress, setLicenseBackProgress] = useState(0);
    const [islicenseBackLoading, setIsLicenseBackLoading] = useState(false);
    
    const [insuranceProgress, setInsuranceProgress] = useState(0);
    const [isInsuranceLoading, setIsInsuranceLoading] = useState(false);
    
    const [roadWorthProgress, setRoadWorthProgress] = useState(0);
    const [isRoadWorthLoading, setIsRoadWorthLoading] = useState(false);
    
    useEffect(() => {
        initialize();
    },[]);
    
    function getCarModels(brandName) {
        var modelList = [];
        // let carrmodels = carModels;
        // eslint-disable-next-line no-unused-vars
        for (let [key, value] of Object.entries(carModels)) {
            if(brandName.toLowerCase() === value.brand.toLowerCase()) {
                // console.log(value.brand);
                let _list = value.models;
                _list.forEach(function (mod) {
                    modelList.push({ label: mod, value: mod })
                });
                setCarModels(modelList);
                // console.log(carModells);
                return;
            }

        }

        setCarModels(modelList);
        console.log(carModells);

    }

    async function initialize() {
        const _loggedIn = await LocalStorage.getBool("isLoggedIn");
        setloggedIn(_loggedIn);
        
        const _local = await LocalStorage.getUserForm("Driver-contacts");
        setUserEmail(_local.email);
    }

    async function savePersonalForm(data) {
        if(driverPhoto === '') {
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        var localData = await LocalStorage.getUserForm("Driver-contacts");
        var userId = localData.uid;
        var _imageName = driverPhoto.name;
        _imageName = _imageName.replace(
            (_imageName.split(".")[0]), 
            (data.firstname + "_" + data.lastname + "_" + userId.substring(0, 7))
            .toLowerCase());

        console.log(_imageName);

        const _uploadImage = uploadImageToStorage("diversprofile", driverPhoto, _imageName);

        // Listen for state changes, errors, and completion of the upload.
        _uploadImage.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // console.log('Upload is ' + progress + '% done');
                setImgProgress(progress);
                // switch (snapshot.state) {
                //     case 'paused':
                //         console.log('Upload is paused');
                //         break;
                //     case 'running':
                //         console.log('Upload is running');
                //         break;
                // }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                console.log(error.code);
                // switch (error.code) {
                //     case 'storage/unauthorized':
                //         // User doesn't have permission to access the object
                //         break;
                //     case 'storage/canceled':
                //         // User canceled the upload
                //         console.log(error.code);
                //         break;

                //     // ...

                //     case 'storage/unknown':
                //         // Unknown error occurred, inspect error.serverResponse
                //         console.log(error.code);
                //         break;
                // }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(_uploadImage.snapshot.ref).then(async (downloadURL) => {
                    var newData = Object.assign({}, data);
                    newData['profile_photo'] = downloadURL;

                    await firebaseCRUDService.updateUserProfile(newData, userId).then(() => {
                        console.log("save success");

                        setIsLoading(false);
                        setIsPersonalDone(true);
                    })
                });
        });
        return true;
    }

    async function saveVehicleInfoForm(data) {
        console.log(data);

        setIsLoading(true);
        setErrorMessage("");

        var localData = await LocalStorage.getUserForm("Driver-contacts");
        var userId = localData.uid;

        await firebaseCRUDService.updateUserProfile(data, userId).then(() => {
            console.log("save success");

            setIsLoading(false);
            setIsDriversInfoDone(true);
        })
        return true;
    }

    async function signoutUser() {
        // eslint-disable-next-line no-unused-vars
        await signOutUser().then((result) => {
            LocalStorage.saveBool("isLoggedIn", false);
            initialize();
        })
    }

    async function uploadLiceFront(data, type) {
        setLicensePhotoFront(data);
        var result = await uploadDocImage(data, type);
        console.log(result);
    }

    async function uploadLiceBack(data, type) {
        setLicensePhotoBack(data);
        var result = await uploadDocImage(data, type);
        console.log(result);
    }

    async function uploadInsur(data, type) {
        setInsuranceStickerPhoto(data);
        var result = await uploadDocImage(data, type);
        console.log(result);
    }

    async function uploadroadWo(data, type) {
        setRoadWorthStickerPhoto(data);
        var result = await uploadDocImage(data, type);
        console.log(result);
    }

    async function uploadDocImage(data, type) {
        // if (licensePhotoFront === '' || licensePhotoBack === ''
        //     || insuranceStickerPhoto === '' || roadWorthStickerPhoto === '') {
        //     return;
        // }
        // console.log(data);

        var imageNameId = uuid.v4().replaceAll("-", "");

        var _imageName = data.name;
        _imageName = _imageName.replace(
            (_imageName.split(".")[0]), imageNameId);
        
        var newData;

        switch (type) {
            case "licenseFront":
                setIsLicenseFrontLoading(true);
                break;
            case "licenseBack":
                setIsLicenseBackLoading(true);
                break;

            case "insuranceSticker":
                setIsInsuranceLoading(true);
                break;

            case "roadWorthSticker":
                setIsRoadWorthLoading(true);
                break;
            default:
                break;
        }
        setErrorMessage("");

        var localData = await LocalStorage.getUserForm("Driver-contacts");
        var userId = localData.uid;

        const _uploadLicenseFrontImage = uploadImageToStorage("diversdocuments", data, _imageName);

        // Listen for state changes, errors, and completion of the upload.
        _uploadLicenseFrontImage.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                
                // if(type === "licenseFront") {

                // }
                switch (type) {
                    case "licenseFront":
                        setLicenseFrontProgress(progress);
                        break;
                    case "licenseBack":
                        setLicenseBackProgress(progress);
                        break;
                
                    case "insuranceSticker":
                        setInsuranceProgress(progress);
                        break;
                
                    case "roadWorthSticker":
                        setRoadWorthProgress(progress);
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                console.log(error.code);
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(_uploadLicenseFrontImage.snapshot.ref).then(async (downloadURL) => {
                    switch (type) {
                        case "licenseFront":
                            newData = {
                                "licenseFrontURL": downloadURL,
                            };
                            break;
                        case "licenseBack":
                            newData = {
                                "licenseBackURL": downloadURL,
                            };
                            break;

                        case "insuranceSticker":
                            newData = {
                                "insuranceStickerURL": downloadURL,
                            };
                            break;

                        case "roadWorthSticker":
                            newData = {
                                "roadWorthStickerURL": downloadURL,
                            };
                            break;
                        default:
                            break;
                    }

                    await firebaseCRUDService.updateUserProfile(newData, userId).then(() => {
                        console.log("save success");
                    })
                });
            });
        return true;
    }

    async function uploadDocsInfoForm(data, type) {
        // if (licensePhotoFront === '' || licensePhotoBack === ''
        //     || insuranceStickerPhoto === '' || roadWorthStickerPhoto === '') {
        //     return;
        // }
        // console.log(data);

        var imageNameId = uuid.v4().replaceAll("-", "");

        var _imageName = data.name;
        _imageName = _imageName.replace(
            (_imageName.split(".")[0]), imageNameId);
        
        var newData;

        switch (type) {
            case "licenseFront":
                setIsLicenseFrontLoading(true);
                break;
            case "licenseBack":
                setIsLicenseBackLoading(true);
                break;

            case "insuranceSticker":
                setIsInsuranceLoading(true);
                break;

            case "roadWorthSticker":
                setIsRoadWorthLoading(true);
                break;
            default:
                break;
        }
        setErrorMessage("");

        var localData = await LocalStorage.getUserForm("Driver-contacts");
        var userId = localData.uid;

        const _uploadLicenseFrontImage = uploadImageToStorage("diversdocuments", data, _imageName);

        // Listen for state changes, errors, and completion of the upload.
        _uploadLicenseFrontImage.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                
                // if(type === "licenseFront") {

                // }
                switch (type) {
                    case "licenseFront":
                        setLicenseFrontProgress(progress);
                        break;
                    case "licenseBack":
                        setLicenseBackProgress(progress);
                        break;
                
                    case "insuranceSticker":
                        setInsuranceProgress(progress);
                        break;
                
                    case "roadWorthSticker":
                        setRoadWorthProgress(progress);
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                console.log(error.code);
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(_uploadLicenseFrontImage.snapshot.ref).then(async (downloadURL) => {
                    switch (type) {
                        case "licenseFront":
                            newData = {
                                "licenseFrontURL": downloadURL,
                            };
                            break;
                        case "licenseBack":
                            newData = {
                                "licenseBackURL": downloadURL,
                            };
                            break;

                        case "insuranceSticker":
                            newData = {
                                "insuranceStickerURL": downloadURL,
                            };
                            break;

                        case "roadWorthSticker":
                            newData = {
                                "roadWorthStickerURL": downloadURL,
                            };
                            break;
                        default:
                            break;
                    }

                    await firebaseCRUDService.updateUserProfile(newData, userId).then(() => {
                        console.log("save success");

                        setIsLoading(false);
                        setIsPersonalDone(true);
                    })
                });
            });
        return true;
    }

    if (loggedIn === false) {
        return <Redirect to="/" />
    }

    // vehicle info
    if(isPersonalDone === true) {
        return (
            <Fragment>
                <Navbar className="container landing-nav" expand="lg">
                    <h4 className="fw-bold">
                        Open Ride
                    </h4>
                    <Navbar.Toggle aria-controls="landing-navbar" />
                    <Navbar.Collapse id="landing-navbar">

                        <Nav className="me-auto">

                        </Nav>

                        <Nav className="ms-auto nav-right">
                            <Nav.Item className="pe-3">
                                {userEmail}
                            </Nav.Item>
                            <Nav.Item className="fw-bold sign-out" onClick={() => signoutUser()}>
                                Sign out
                            </Nav.Item>
                        </Nav>


                    </Navbar.Collapse>
                </Navbar>

                <div className="container d-flex flex-column align-items-center justify-content-center personal-details">

                    <Row className="">
                        <Col md={12} sm={12} lg={12}>

                            <div className="p-4  mt-3">

                                <h3 className="mb-2">Vehicle Information</h3>
                                <small>Complete the required steps below to continue</small>

                                <p className="mb-2"></p>
                                {/* error message */}
                                <small className="text-danger">{errorMessage}</small>

                                <Form onSubmit={submitVehicleInfo(saveVehicleInfoForm)} className="">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Vehicle manufacturer</Form.Label>
                                        <Controller
                                            name="vehicleManufacturer"
                                            control={control}
                                            defaultValue={""}
                                            // rules={{ required: true }}
                                            // eslint-disable-next-line no-unused-vars
                                            render={({ field: { onChange, value, name, ref }}) =>
                                            <Select className=""
                                                ref={ref}
                                                options={manufacturers}
                                                value={manufacturers.find(c => c.name === value)}
                                                onChange={val => {
                                                    onChange(val.name)
                                                    getCarModels(val.name);
                                                    // console.log(val.name);
                                                }}
                                                getOptionLabel={(_manufacturer) => _manufacturer.name.toUpperCase()}
                                                getOptionValue={(_manufacturer) => _manufacturer.name}
                                                />
                                            }
                                        />
                                        <Form.Text className="text-danger register-driver-privacy">
                                            {vehInfoErrors.vehicleManufacturer?.message}
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Vehicle model</Form.Label>
                                        <Controller
                                            name="vehicleModel"
                                            control={control}
                                            defaultValue={""}
                                            // rules={{ required: true }}
                                            // eslint-disable-next-line no-unused-vars
                                            render={({ field: { onChange, value, name, ref }}) =>
                                            <Select className=""
                                                ref={ref}
                                                options={carModells}
                                                value={carModells.find(c => c.value === value)}
                                                onChange={val => onChange(val.value)}
                                                // getOptionLabel={carModell => carModell.toUpperCase()}
                                                // getOptionValue={carModell => carModell}
                                                />
                                            }
                                        />
                                        <Form.Text className="text-danger register-driver-privacy">
                                            {vehInfoErrors.vehicleModel?.message}
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Vehicle year</Form.Label>
                                        <Controller
                                            name="vehicleYear"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => 
                                                <select {...field} className="form-control" aria-label="Default select">
                                                    {
                                                        years.current.map((year, index) => {
                                                            return <option key={index} value={year}>{year}</option>
                                                        })
                                                    }
                                                </select>
                                            }
                                        />
                                        {/* <select {...register("vehicleYear")} className="form-control" aria-label="Default select">
                                            {
                                                years.current.map((year, index) => {
                                                    return <option key={index} value={year}>{year}</option>
                                                })
                                            }
                                        </select> */}
                                        <Form.Text className="text-danger register-driver-privacy">
                                            {vehInfoErrors.vehicleYear?.message}
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>License plate</Form.Label>
                                        <Controller
                                            name="licensePlate"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => 
                                                <Form.Control {...field} type="text" placeholder="Enter license plate" />}
                                        />
                                        {/* <Form.Control {...register("licensePlate")} type="text" placeholder="Enter license plate" /> */}

                                        <Form.Text className="text-danger register-driver-privacy">
                                            {vehInfoErrors.licensePlate?.message}
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Vehicle color</Form.Label>
                                        <Controller
                                            name="carColor"
                                            control={control}
                                            defaultValue={""}
                                            // eslint-disable-next-line no-unused-vars
                                            render={({ field: { onChange, value, name, ref }}) =>
                                            <Select className=""
                                                ref={ref}
                                                // aria-label="Default select"
                                                // name={carColor}
                                                options={carColors}
                                                value={carColors.find(c => c.value === value)}
                                                onChange={val => onChange(val.value)}
                                                getOptionLabel={(_carColor) => _carColor.name}
                                                getOptionValue={(_carColor) => _carColor.value}
                                                />
                                            }
                                        />

                                        <Form.Text className="text-danger register-driver-privacy">
                                            {vehInfoErrors.carColor?.message}
                                        </Form.Text>
                                    </Form.Group>

                                    <div className="d-flex mt-5">
                                        {/* <div> */}
                                        <Button type={isLoading === false ? "submit" : "null"}>
                                            {
                                                isLoading === false ? "Next"
                                                    :
                                                    // <Box sx={{ display: 'flex' }}>
                                                    <CircularProgress size="25px" color="inherit" />
                                                // </Box>
                                            }
                                        </Button>
                                        {/* </div> */}
                                    </div>

                                </Form>

                            </div>


                        </Col>
                    </Row>
                </div>
            </Fragment>
        )
    }

    // vehicle docs
    if(isDriversInfoDone !== true) {
        return (
            <Fragment>
                <Navbar className="container landing-nav" expand="lg">
                    <h4 className="fw-bold">
                        Open Ride
                    </h4>
                    <Navbar.Toggle aria-controls="landing-navbar" />
                    <Navbar.Collapse id="landing-navbar">

                        <Nav className="me-auto">

                        </Nav>

                        <Nav className="ms-auto nav-right">
                            <Nav.Item className="pe-3">
                                {userEmail}
                            </Nav.Item>
                            <Nav.Item className="fw-bold sign-out" onClick={() => signoutUser()}>
                                Sign out
                            </Nav.Item>
                        </Nav>


                    </Navbar.Collapse>
                </Navbar>

                <div className="container d-flex flex-column align-items-center justify-content-center personal-details">

                    <Row className="">
                        <Col md={12} sm={12} lg={12}>

                            <div className="p-4  mt-3">

                                <h3 className="mb-2">Drivers license and document details</h3>
                                <small>Complete the required steps below to continue</small>

                                <p className="mb-2"></p>
                                {/* error message */}
                                <small className="text-danger">{errorMessage}</small>

                                <Form onSubmit={submitDocsInfo(uploadDocsInfoForm)} className="">

                                    {/* upload front face of drivers license */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ghana Drivers License Front</Form.Label>
                                        {islicenseFrontLoading === true && <BorderLinearProgress variant="determinate" value={licenseFrontProgress} />}
                                        <InputGroup>
                                            <Form.Control onClick={() => setLicenseFrontUploadModal(true)}
                                                type="button" value={
                                                    licensePhotoFront !== '' ? licensePhotoFront.name : "upload a photo"} />

                                            {isLoading === true &&
                                                <CircularProgress variant="determinate" value={imgProgress} size="25px" color="inherit" />
                                            }
                                        </InputGroup>
                                        {/* <LinearProgress variant="determinate" value={licenseFrontProgress}  */}

                                        <Form.Text className="text-danger register-driver-privacy">
                                            {licensePhotoFront === '' && "Please attach image"}
                                        </Form.Text>
                                    </Form.Group>

                                    <UploadDocsPhotoModal
                                        open={showLicenseFrontUploadModal}
                                        close={() => setLicenseFrontUploadModal(false)}
                                        upload={(data) => uploadLiceFront(data, "licenseFront")}
                                        title="Take a photo of your Ghana Drivers License"
                                        content="Please make sure we can read all of the details easily."
                                        imageExample={licenseFrontImage}
                                    />

                                    
                                    {/* upload back face of drivers license */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Reverse Side of Ghana Drivers License</Form.Label>
                                        {islicenseBackLoading === true && <BorderLinearProgress variant="determinate" value={licenseBackProgress} />}
                                        <InputGroup>
                                            <Form.Control onClick={() => setLicenseBackUploadModal(true)}
                                                type="button" value={
                                                    licensePhotoBack !== '' ? licensePhotoBack.name : "upload a photo"} />

                                            {isLoading === true &&
                                                <CircularProgress variant="determinate" value={imgProgress} size="25px" color="inherit" />
                                            }
                                        </InputGroup>

                                        <Form.Text className="text-danger register-driver-privacy">
                                            {licensePhotoBack === '' && "Please attach image"}
                                        </Form.Text>
                                    </Form.Group>

                                    <UploadDocsPhotoModal
                                        open={showLicenseBackUploadModal}
                                        close={() => setLicenseBackUploadModal(false)}
                                        title="Take a photo of your Reverse side of Ghana Drivers License"
                                        content="All information must be legible and not blurred. Make sure 
                                        that the entire document is legible with all four corners visible. 
                                        your document will not be accepted if it is illegible or not all 4 
                                        corners are visible"
                                        imageExample={licenseBackImage}
                                        upload={(data) => uploadLiceBack(data, "licenseBack")}
                                        // => {
                                        //     console.log(licensePhotoBack);
                                        //     if (licensePhotoBack !== '') {
                                        //         uploadDocImage(licensePhotoBack, "licenseBack");
                                        //     }
                                        // }}
                                    />
                                    
                                    {/* upload insurance sticker */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Proof of Insurance/Insurance Sticker</Form.Label>
                                        {isInsuranceLoading === true && <BorderLinearProgress variant="determinate" value={insuranceProgress} />}
                                        <InputGroup>
                                            <Form.Control onClick={() => setInsuranceStickerUploadModal(true)}
                                                type="button" value={
                                                    insuranceStickerPhoto !== '' ? insuranceStickerPhoto.name : "upload a photo"} />

                                            {isLoading === true &&
                                                <CircularProgress variant="determinate" value={imgProgress} size="25px" color="inherit" />
                                            }
                                        </InputGroup>

                                        <Form.Text className="text-danger register-driver-privacy">
                                            {insuranceStickerPhoto === '' && "Please attach image"}
                                        </Form.Text>
                                    </Form.Group>

                                    <UploadDocsPhotoModal
                                        open={showInsuranceStickerUploadModal}
                                        close={() => setInsuranceStickerUploadModal(false)}
                                        title="Take a photo of your Insurance Sticker"
                                        content="Please make sure the following details are clearly visible 
                                        and easy to read: your policy number OR serial number, the expiry date 
                                        and the insurance issuer."
                                        imageExample={insuranceStickerImage}
                                        upload={(data) => uploadInsur(data, "insuranceSticker")}
                                    />
                                    
                                    {/* upload road worthiness sticker */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Roadworthiness Sticker</Form.Label>
                                        {isRoadWorthLoading === true && <BorderLinearProgress variant="determinate" value={roadWorthProgress} />}
                                        <InputGroup>
                                            <Form.Control onClick={() => setRoadWorthStickerUploadModal(true)}
                                                type="button" value={
                                                    roadWorthStickerPhoto !== '' ? roadWorthStickerPhoto.name : "upload a photo"} />

                                            {isLoading === true &&
                                                <CircularProgress variant="determinate" value={imgProgress} size="25px" color="inherit" />
                                            }
                                        </InputGroup>

                                        <Form.Text className="text-danger register-driver-privacy">
                                            {roadWorthStickerPhoto === '' && "Please attach image"}
                                        </Form.Text>
                                    </Form.Group>

                                    <UploadDocsPhotoModal
                                        open={showRoadWorthStickerUploadModal}
                                        close={() => setRoadWorthStickerUploadModal(false)}
                                        title="Take a photo of your Roadworthiness Sticker from the DVLA"
                                        content="Kindly make sure that the following details are clearly visible and 
                                        easy to read: the car licence number, the roadworthiness certificate number, and 
                                        the expiry date of the roadworthiness sticker."
                                        imageExample={roadWorthStickerImage}
                                        upload={(data) => uploadroadWo(data, "roadWorthSticker")}
                                    />

                                    
                                    {/* next button */}
                                    <div className="d-flex mt-5">
                                        {/* <div> */}
                                        <Button type="submit">
                                            {
                                                isLoading === false ? "Done"
                                                    :
                                                    // <Box sx={{ display: 'flex' }}>
                                                    <CircularProgress size="25px" color="inherit" />
                                                // </Box>
                                            }
                                        </Button>
                                        {/* </div> */}
                                    </div>

                                </Form>

                            </div>


                        </Col>
                    </Row>
                </div>
            </Fragment>
        )
    }

    return (
        <Fragment>
            <Navbar className="container landing-nav" expand="lg">
                <h4 className="fw-bold">
                    Open Ride
                </h4>
                <Navbar.Toggle aria-controls="landing-navbar" />
                <Navbar.Collapse id="landing-navbar">

                    <Nav className="me-auto">
                        
                    </Nav>

                    <Nav className="ms-auto nav-right">
                        <Nav.Item className="pe-3">
                                {userEmail}
                        </Nav.Item>
                        <Nav.Item className="fw-bold sign-out" onClick={() => signoutUser()}>
                                Sign out
                        </Nav.Item>
                    </Nav>


                </Navbar.Collapse>
            </Navbar>

            <div className="container d-flex flex-column align-items-center justify-content-center personal-details">
                
                <Row className="">
                    <Col md={12} sm={12} lg={12}>

                        <div className="p-4  mt-3">

                            <h3 className="mb-2">Hello,</h3>
                            <small>Complete the required steps below to continue</small>

                            <p className="mb-2"></p>
                            {/* error message */}
                            <small className="text-danger">{errorMessage}</small>

                            <Form onSubmit={handleSubmit(savePersonalForm)} className="">
                                <Form.Group className="mb-3">
                                    <Form.Label>First name</Form.Label>
                                    <Form.Control {...register("firstname")} type="text" placeholder="Enter first name" />
                                    <Form.Text className="text-danger register-driver-privacy">
                                        {errors.firstname?.message}
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Last name</Form.Label>
                                    <Form.Control {...register("lastname")} type="text" placeholder="Enter last name" />
                                    
                                    <Form.Text className="text-danger register-driver-privacy">
                                        {errors.lastname?.message}
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Upload your profile photo</Form.Label>
                                    <InputGroup>
                                    <Form.Control onClick={() => setShowUploadModal(true)} 
                                        type="button" value={
                                            driverPhoto !== '' ? driverPhoto.name : "upload a photo"} />

                                    {isLoading === true &&
                                            <CircularProgress variant="determinate" value={imgProgress} size="25px" color="inherit" />
                                    }
                                    </InputGroup>
                                    
                                    <Form.Text className="text-danger register-driver-privacy">
                                        {driverPhoto === '' && "Please attach image"}
                                    </Form.Text>
                                </Form.Group>

                                <UploadPhotoModal
                                    open={showUploadModal}
                                    close={() => setShowUploadModal(false)}
                                    setPhoto={async (val) => setDriverPhoto(val)}
                                />

                                <div className="d-flex mt-5">
                                    {/* <div> */}
                                        <Button type="submit">
                                            {
                                                isLoading === false ? "Next"
                                                    :
                                                    // <Box sx={{ display: 'flex' }}>
                                                        <CircularProgress size="25px" color="inherit" />
                                                    // </Box>
                                            }
                                        </Button>
                                    {/* </div> */}
                                </div>

                            </Form>

                        </div>


                    </Col>
                </Row>
            </div>
        </Fragment>
    )
};

export default DriverOnboarding