import React, { Fragment, useEffect, useState, useCallback } from "react";
import { Button, Card, Col, Form, InputGroup, Row, } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import LocalStorage from "../../../services/localStorage";
import { useHistory } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import firebaseCRUDService from "../../../services/firebaseUtils";
import "./index.css"; 
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import VerificationInput from "react-verification-input";

/// validation
const schema = yup.object({
    mobileNumber: yup.string()
        .min(10, "Please enter 10 digits phone number")
        .required("This field is requried"),

}).required();


const RegisterRide = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    
    let history = useHistory();
    
    const [errorMessage, setErrorMessage] = useState("");

    const [confirmCode, setConfirmCode] = useState(false);

    const [mobileNumber, setMobileNumber] = useState("");

    const [smsCode, setSMSCode] = useState("");
    const [smsCodeInvalid, setSMSCodeInvalid] = useState(false);

    const [confirmResultt, setConfirmResultt] = useState(null);

    const auth = getAuth();
    
    const signUpPhone = useCallback(async (data) => {
        const appVerifier = window.recaptchaVerifier;

        // console.log(appVerifier);
        // return;
        setIsLoading(true);
        setErrorMessage("");
        let _phoneNumber = "+233" + data.mobileNumber.substring(1);
        setMobileNumber(_phoneNumber);
        // console.log(_phoneNumber);
        // return;

        await signInWithPhoneNumber(auth, _phoneNumber, appVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                console.log(confirmationResult);
                setConfirmResultt(confirmationResult);
                setConfirmCode(true);
                // ...
            }).catch((error) => {
                // Error; SMS not sent
                console.log(error);
                    // eslint-disable-next-line no-undef
                grecaptcha.reset(appVerifier.widgetId);
                // });
            });


        setIsLoading(false);
        return true;
    }, [auth]);

    const confirmResultCode = useCallback(async () => {
        setSMSCodeInvalid(false);
        if (smsCode === "" || smsCode.length < 6) {
            setSMSCodeInvalid(true);
            return;
        }
        setIsLoading(true);
        setErrorMessage("");
        // var _namespace = uuid.v1().replaceAll("-", "");
        // let confirmationResult = window.confirmationResult;

        await confirmResultt.confirm(smsCode).then(async (result) => {
            // User signed in successfully.
            // console.log(result);
            
            var newData = Object.assign({}, "");
            console.log(mobileNumber);

                newData['uid'] = result.user.uid;
                newData['mobileNumber'] = mobileNumber;
                newData['userType'] = "rider";

                LocalStorage.saveUserForm("ride-user-data", newData);

                await firebaseCRUDService.updateUserProfile(newData, result.user.uid).then(() => {
                    console.log("save success");
                    LocalStorage.saveBool("isLoggedIn", true);

                    history.push(`/ride-home`);
                    return;
                }).catch((error) => {
                    console.log(error);
                });
            // ...
        }).catch((error) => {
            // User couldn't sign in (bad verification code?)
            console.log(error.code);
            if (error.code.includes("invalid-verification-code")) {
                setErrorMessage("Invalid verification code");
            }
            // ...
        });


        setIsLoading(false);
        return true;
    }, [confirmResultt, history, mobileNumber, smsCode]);

    useEffect(() => {
        window.recaptchaVerifier = new RecaptchaVerifier('phone-next-btn', {
            'size': 'invisible',
            'callback': (response) => {
                console.log(response);
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                console.log("submitting");
                // handleSubmit(signUpPhone);
            },
            // 'expired-callback': () => {
            //     // Response expired. Ask user to solve reCAPTCHA again.
            //     recaptchaVerify(phoneNumber)
            // }
        }, auth);
    }, [auth, handleSubmit, signUpPhone])

    if (confirmCode) {
        return (
            <Fragment>
                <div className="container d-flex flex-column align-items-center justify-content-center">

                    <Row className="">
                        <Col md={10} sm={10} lg={11}>

                            <Card className="p-4 register-driver-form mt-3">

                                <h3 className="mb-3">Open Ride | Ride</h3>

                                {/* error message */}
                                <small className="text-danger">{errorMessage}</small>

                                <Form className="">

                                    <Form.Group className="mb-3">
                                        <Form.Label>Confirmation code</Form.Label>
                                        <InputGroup>
                                            {/* <Form.Control {...register("mobileNumber")} className="phone-field" maxLength={10} type="number" placeholder="Enter phone number" /> */}
                                            <VerificationInput classNames={{
                                                container: "confirmInput-container",
                                                character: "confirmInput-character",
                                                characterInactive: "confirmInput-character--inactive",
                                                characterSelected: "confirmInput-character--selected",
                                                }} 
                                                validChars="0-9"
                                                onChange={setSMSCode}
                                            />

                                            {/* <FieldControl
                                            render={TextInput}
                                            meta={{ label: "Full name", name: "Full name" }}
                                            id="name"
                                            name="name" /> */}
                                        </InputGroup>
                                        {smsCodeInvalid && <Form.Text className="text-danger register-driver-privacy">
                                            Please enter 6 digits confirmation code
                                        </Form.Text>
                                        }
                                    </Form.Group>

                                    {/* <div className="d-flex"> */}
                                    {/* <div> */}
                                    <Button className="next-btn" id="phone-signin-btn" type="button"
                                    onClick={confirmResultCode}>
                                        {
                                            isLoading === false ? "Sign in"
                                                :
                                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                    <CircularProgress size="25px" color="inherit" />
                                                </Box>
                                        }
                                    </Button>
                                    {/* </div> */}

                                    {/* <div className="d-flex align-items-center already-account-driver">
                                        <p className="ms-3 ms-lg-4 ms-md-4 ms-xl-4 ms-xxl-4">Already have an account? <a onClick={() => history.push("/login-driver")} href="# ">Sign in</a></p>
                                    </div> */}
                                    {/* </div> */}

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
    }

    return (
        <Fragment>
            <div className="container d-flex flex-column align-items-center justify-content-center">
                
                <Row className="">
                    <Col md={10} sm={10} lg={11}>

                        <Card className="p-4 register-driver-form mt-3">

                            <h3 className="mb-3">Open Ride | Ride</h3>

                            {/* error message */}
                            <small className="text-danger">{errorMessage}</small>

                            <Form onSubmit={handleSubmit(signUpPhone)} className="">

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

                                {/* <div className="d-flex"> */}
                                    {/* <div> */}
                                             <Button className="next-btn center" id="phone-next-btn" type="submit">
                                            {
                                                isLoading === false ? "Next"
                                                    :
                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <CircularProgress size="25px" color="inherit" />
                                                    </Box>
                                            }
                                        </Button>
                                    {/* </div> */}

                                    {/* <div className="d-flex align-items-center already-account-driver">
                                        <p className="ms-3 ms-lg-4 ms-md-4 ms-xl-4 ms-xxl-4">Already have an account? <a onClick={() => history.push("/login-driver")} href="# ">Sign in</a></p>
                                    </div> */}
                                {/* </div> */}

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
}

export default RegisterRide