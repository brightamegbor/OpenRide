import React, { Fragment, useState, useEffect } from "react";
import { 
    Button, 
    Col, Form, 
    Nav, Navbar, Row,
    Modal,
    Image
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
import { signUpWithEmail, signOutUser } from "../../../services/firebaseUtils";
import firebaseCRUDService from "../../../services/firebaseUtils";
import Slide from '@material-ui/core/Slide';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withStyles } from "@material-ui/core";
import imageUploadGlobal from '../../../assets/images/profile_photo_upload.png';

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

    useEffect(() => {
        initialize();
    },[]);

    async function initialize() {
        const _loggedIn = await LocalStorage.getBool("isLoggedIn");
        setloggedIn(_loggedIn);
        
        const _local = await LocalStorage.getUserForm("Driver-contacts");
        setUserEmail(_local.email);
    }

    async function saveContactsForm(data) {
        setIsLoading(true);
        setErrorMessage("");
        var _namespace = uuid.v1().replaceAll("-", "");

        await signUpWithEmail(data.email, data.password).then(async (result) => {
            console.log(result);

            var newData = Object.assign({}, data);
            if (result.uid != null) {
                newData['onboardingID'] = _namespace;
                newData['uid'] = result.uid;
                newData['password'] = "";
                newData['creationTime'] = result.metadata.creationTime;
                newData['emailVerified'] = result.emailVerified;

                LocalStorage.saveUserForm("Driver-contacts", newData);

                await firebaseCRUDService.saveUserProfile(newData).then(() => {
                    console.log("save success");
                    LocalStorage.saveBool("isLoggedIn", true);

                    history.push(`/register-driver/onboarding/${_namespace}`);
                })
                    .catch((error) => {
                        console.log(error);
                    });
            } else if (result.code != null) {
                let errorCode = result.code;
                console.log(result.code);
                if (errorCode.includes("email-already-in-use")) {
                    setErrorMessage("Email address already exist, please sign in");
                }
            }
        });


        setIsLoading(false);
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

                            <Form onSubmit={handleSubmit(saveContactsForm)} className="">
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
                                    <Form.Control onClick={() => setShowUploadModal(true)} 
                                        type="button" value={driverPhoto !== '' ? driverPhoto.name : "upload a photo"} />
                                    
                                    {/* <Form.Text className="">
                                        {driverPhoto !== '' && driverPhoto.name}
                                    </Form.Text> */}
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
                                                    <Box sx={{ display: 'flex' }}>
                                                        <CircularProgress size="25px" color="inherit" />
                                                    </Box>
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