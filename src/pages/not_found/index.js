import React from 'react';
import { Fragment } from "react"
import { Button, Nav, Navbar } from "react-bootstrap"
import { Link } from 'react-router-dom';
import "./index.css";

const NotFoundComponent = () => {

    return (
        <Fragment>
            <Navbar className="container landing-nav" expand="lg">
                <Navbar.Brand href="/">
                    Open Ride
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="landing-navbar" />
                <Navbar.Collapse id="landing-navbar">

                    <Nav
                        activeKey="/"
                        className="me-auto"
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="link-1"><Link to="/register-ride"> Sign up </Link> </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="link-2">Log in</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/register-driver" eventKey="register-driver">
                                Register as a driver
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Nav className="ms-auto nav-right">
                        <Nav.Item>
                            <Nav.Link eventKey="about-us">
                                About us
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="how it works">
                                How Open Ride works
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>


                </Navbar.Collapse>
            </Navbar>

            <div className="h-50 d-flex align-items-center justify-content-center">
                <h1 className="align-self-center">Page not found!!</h1>
            </div>
        </Fragment>
    )

}

export default NotFoundComponent