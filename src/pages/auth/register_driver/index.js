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
import { signUpWithEmail } from "../../../services/firebaseUtils";
import firebaseCRUDService from "../../../services/firebaseUtils";

/// validation
const schema = yup.object({
    email: yup.string().required("This field is required"),
    mobileNumber: yup.string()
    .min(10, "Please enter 10 digits phone number")
    .required("This field is requried"),
    city: yup.string().required("This field is required"),
    password: yup.string().required("This field is required"),
    
}).required();

const RegisterDriver = () => {
    const [obsecureText, setObsecureText] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    let history = useHistory();

    const [errorMessage, setErrorMessage] = useState("");

    async function saveContactsForm(data) {
        setIsLoading(true);
        setErrorMessage("");
        var _namespace = uuid.v1().replaceAll("-", "");

        await signUpWithEmail(data.email, data.password).then(async (result) => {
            console.log(result);

            var newData = Object.assign({}, data);
            if(result.uid != null) {
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

    return(
        <Fragment>
            <div className="container d-flex flex-column align-items-center justify-content-center">
                <div className="rd-rgp">
                    <a href="/ride">Ride</a>
                </div>
                <Row className="">
                    <Col md={10} sm={10} lg={11}>
                    
                        <Card className="p-4 register-driver-form mt-3">

                            <h3 className="mb-3">Open Ride | Register as a driver</h3>

                            {/* error message */}
                            <small className="text-danger">{errorMessage}</small>
                            
                            <Form onSubmit={handleSubmit(saveContactsForm)} className="">
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control {...register("email")} type="email" placeholder="Enter email address" />
                                    <Form.Text className="text-danger register-driver-privacy">
                                        {errors.email?.message}
                                    </Form.Text>
                                </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Phone number</Form.Label>
                                    <InputGroup>
                                    <span className="country-prefix">+233</span>
                                        <Form.Control {...register("mobileNumber")} className="phone-field" maxLength={10} type="number" placeholder="Enter phone number" />
                                        
                                        {/* <FieldControl
                                            render={TextInput}
                                            meta={{ label: "Full name", name: "Full name" }}
                                            id="name"
                                            name="name" /> */}
                                    </InputGroup>
                                    <Form.Text className="text-danger register-driver-privacy">
                                        {errors.mobileNumber?.message}
                                    </Form.Text>
                            </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>City</Form.Label>
                                    <select {...register("city")} className="form-control" aria-label="Default select">
                                        <option value="" disabled>Select city</option>
                                        <option value="Accra">Accra</option>
                                        <option value="Kumasi">Kumasi</option>
                                        <option value="Cape Coast">Cape Coast</option>
                                    </select>
                                    <Form.Text className="text-danger register-driver-privacy">
                                        {errors.city?.message}
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

                                <div className="d-flex">
                                    <div>
                                        <Button type="submit">
                                            {
                                                isLoading === false ? "Next"
                                                : 
                                                <Box sx={{ display: 'flex' }}>
                                                    <CircularProgress size="25px" color="inherit" />
                                                </Box>
                                            }
                                        </Button>
                                    </div>

                                    <div className="d-flex align-items-center already-account-driver">
                                        <p className="ms-3 ms-lg-4 ms-md-4 ms-xl-4 ms-xxl-4">Already have an account? <a onClick={() => history.push("/login-driver")} href="# ">Sign in</a></p>
                                    </div>
                                </div>

                                <Form.Group className="mt-3">
                                    <Form.Text className="text-muted register-driver-privacy">
                                        By signing up, I accept Open Ride Terms of Service and Privacy Policy.
                                    </Form.Text>
                                </Form.Group>

                        </Form>
                    
                    </Card>

                    
                    </Col>
                </Row>
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

export default RegisterDriver