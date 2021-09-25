import React, { Fragment, useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row, } from "react-bootstrap";
import "./index.css";
import {
    MdRemoveRedEye
} from "react-icons/md";
import {
    FaEyeSlash
} from "react-icons/fa";

const inputFieldValidator = ({ label, touched, error, customInputLabel}) => {
    if(touched && error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {customInputLabel && <>{customInputLabel}</>}
            {!customInputLabel && (
                <>
                Please enter <b>{label}</b>
                </>
            )}
        </div>
    );
}

const RegisterDriver = () => {
    const [obsecureText, setObsecureText] = useState(true);

    return(
        <Fragment>
            <div className="container d-flex flex-column align-items-center justify-content-center">
                <Row className="">
                    <Col md={8} sm={10} lg={12}>
                    
                    <Card className="p-4 register-driver-form mt-3">

                    <h3 className="mb-3">Open Ride | Register as a driver</h3>
                    <Form className="">
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter email address" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone number</Form.Label>
                            <InputGroup>
                            <span className="country-prefix">+233</span>
                                <Form.Control className="phone-field" type="phone" placeholder="Enter phone number" />

                                {/* <FieldControl
                                    render={TextInput}
                                    meta={{ label: "Full name", name: "Full name" }}
                                    id="name"
                                    name="name" /> */}
                            </InputGroup>
                    </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <select className="form-control" aria-label="Default select example">
                                <option disabled>Select city</option>
                                <option value="1">Accra</option>
                                <option value="2">Kumasi</option>
                                <option value="3">Cape Coast</option>
                            </select>
                        </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                                <Form.Control className="password-field" type={obsecureText ? "password" : "text"} placeholder="Enter password" />
                                <span onClick={() => setObsecureText(!obsecureText)} className="password-visibility">
                                    {obsecureText === true ? <MdRemoveRedEye /> : <FaEyeSlash /> } </span>
                        </InputGroup>
                    </Form.Group>

                        <div className="d-flex">
                            <div>
                                <Button variant="secondary" type="submit">
                                    Next
                                </Button>
                            </div>

                            <div className="d-flex align-items-center already-account-driver">
                                <p className="ms-4">Already have an account? <a href="/#">Sign in</a></p>
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
            </div>
        </Fragment>
    )

};

export default RegisterDriver