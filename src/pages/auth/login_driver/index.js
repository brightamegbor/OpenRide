import React, { Fragment, useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row, } from "react-bootstrap";
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
import { useHistory } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { signInWithEmail } from "../../../services/firebaseUtils";
import firebaseCRUDService from "../../../services/firebaseUtils";

/// validation
const schema = yup.object({
    email: yup.string().required("This field is required"),
    password: yup.string().required("This field is required"),
    
}).required();

const LoginDriver = () => {
    const [obsecureText, setObsecureText] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    let history = useHistory();

    const [errorMessage, setErrorMessage] = useState("");

    async function logUserIn(data) {
        setIsLoading(true);
        setErrorMessage("");

        await signInWithEmail(data.email, data.password).then(async (result) => {
            console.log(result);

            // var newData = Object.assign({}, data);
            if(result.uid != null) {
                console.log(result.uid);

                await firebaseCRUDService.getDriverUserProfile(data.email).then((userProfileData) => {
                    console.log(userProfileData);

                    // newData['uid'] = result.uid;
                    // newData['emailVerified'] = result.emailVerified;
                    // newData['email'] = userProfileData.email;
                    // newData['mobileNumber'] = userProfileData.mobileNumber;
                    // newData['city'] = userProfileData.city;

                    LocalStorage.saveUserForm("UserDetails", userProfileData);

                    console.log("save success");
                    LocalStorage.saveBool("isLoggedIn", true);


                    history.push("/driver-dashboard");
                })
                    .catch((error) => {
                        console.log(error);
                    });

            } else if (result.code != null) {
                let errorCode = result.code;
                console.log(result.code);
                if (errorCode.includes("user-not-found") || errorCode.includes("wrong-password")) {
                    setErrorMessage("Invalid email address or password");
                }
            }
        });
        

        setIsLoading(false);
        return true;
    }

    return(
        <Fragment>
            <div className="container d-flex flex-column align-items-center justify-content-center">
                
                {/* <Row className=""> */}
                    {/* <Col md={12} sm={12} lg={12}> */}

                <p className="mt-4"></p>
                    
                        <Card className="p-4 mt-3">

                            <h3 className="mb-3">Open Ride | Driver login</h3>

                            {/* error message */}
                            <small className="text-danger">{errorMessage}</small>
                            
                            <Form onSubmit={handleSubmit(logUserIn)} className="">
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control {...register("email")} type="email" placeholder="Enter email address" />
                                    <Form.Text className="text-danger register-driver-privacy">
                                        {errors.email?.message}
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control {...register("password", { minLength: 8 })} className="password-field" type={obsecureText ? "password" : "text"} placeholder="Enter password" />
                                        <span onClick={() => setObsecureText(!obsecureText)} className="password-visibility">
                                            {obsecureText === true ? <MdRemoveRedEye /> : <FaEyeSlash /> } </span>
                                    </InputGroup>

                                    <Form.Text className="text-danger register-driver-privacy">
                                        {errors.password?.message}
                                    </Form.Text>
                                </Form.Group>

                                <p className="forgot-password text-end">
                                    Forgot <a href="# ">password?</a>
                                </p>

                                {/* <div className="d-flex"> */}
                                    {/* <div> */}
                                        <Button className="login-btn text-center" type="submit">
                                            {
                                                isLoading === false ? "Log In"
                                                : 
                                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                    <CircularProgress size="22px" color="inherit" />
                                                </Box>
                                            }
                                        </Button>
                                    {/* </div> */}
                                {/* </div> */}

                                <p className="mt-4"></p>
                                <p className="mt-4"></p>

                                <div className="">
                                    <p className="text-center">Not a driver? <a href="# ">Sign Up</a></p>
                                </div>

                        </Form>
                    
                    </Card>

                    
                    {/* </Col> */}
                {/* </Row> */}
                    <div className="d-flex justify-content-center mt-2 register-driver-footer">
                        <p className="pe-3">Accessibility</p>
                        <p className="pe-3">Privacy</p>
                        <p className="pe-3">Terms</p>
                    </div>

                    <div className="d-flex justify-content-center register-driver-footer">
                        <p className="text-center">&copy; {new Date().getFullYear()} Open Ride Inc. All rights reserved, Open Ride is 
                            unregistered trademark of Bright Amegbor. 
                        </p>
                    </div>
            </div>
        </Fragment>
    )
};

export default LoginDriver