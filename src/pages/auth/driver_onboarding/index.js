import React, { Fragment, useState, useEffect } from "react";
import { 
    Button, 
    Col, Form, 
    Nav, Navbar, Row,
    Modal,
    Image,
    InputGroup
} from "react-bootstrap";
import "./index.css";
import {
    MdRemoveRedEye
} from "react-icons/md";
import {
    FaEyeSlash
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import LocalStorage from "../../../services/localStorage";
import * as uuid from 'uuid';
import { useHistory, Redirect } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { uploadImageToStorage, signOutUser } from "../../../services/firebaseUtils";
import firebaseCRUDService from "../../../services/firebaseUtils";
import Slide from '@material-ui/core/Slide';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withStyles } from "@material-ui/core";
import imageUploadGlobal from '../../../assets/images/profile_photo_upload.png';
import { getDownloadURL } from "firebase/storage";

/// validation
const schema = yup.object({
    firstname: yup.string().required("This field is required"),
    lastname: yup.string().required("This field is required"),
    // password: yup.string().required("This field is required"),

}).required();


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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DriverOnboarding = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    let history = useHistory();

    const [errorMessage, setErrorMessage] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [loggedIn, setloggedIn] = useState();
    const [showUploadModal, setShowUploadModal] = React.useState(false);
    
    const [driverPhoto, setDriverPhoto] = useState('');
    const [imgProgress, setImgProgress] = useState(0);
    
    const [isPersonalDone, setIsPersonalDone] = useState();

    useEffect(() => {
        initialize();
    },[]);

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

    async function signoutUser() {
        await signOutUser().then((result) => {
            LocalStorage.saveBool("isLoggedIn", false);
            initialize();
        })
    }

    if (loggedIn === false) {
        return <Redirect to="/" />
    }

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
                                        setPhoto={(val) => setDriverPhoto(val)}
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
                                    setPhoto={(val) => setDriverPhoto(val)}
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