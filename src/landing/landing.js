import React, { Component } from 'react';
import './landing.css';
import { Card, Container, Row, Col, Nav, Navbar } from 'react-bootstrap';

class Landing extends Component {
    // componentDidMount() {
    //     var scrollpos = window.scrollY;
    //     var navbar = document.querySelector("nav");

    //     function add_class_on_scroll() {
    //         navbar.classList.remove("navbar-dark", "bg-dark", "shadow");
    //         navbar.classList.add("navbar-light", "bg-light", "shadow");
    //     }

    //     function remove_class_on_scroll() {
    //         navbar.classList.remove("navbar-light", "bg-light", "shadow");
    //         navbar.classList.add("navbar-dark", "bg-dark");
    //     }

    //     window.addEventListener('scroll', function () {
    //         scrollpos = window.scrollY;

    //         if (scrollpos > 60) {
    //             add_class_on_scroll();
    //         } else {
    //             remove_class_on_scroll();
    //         }
    //     });

    //     let state = localStorage["appState"];

    //     if (state) {
    //         let AppState = JSON.parse(state);
    //         console.log(AppState);
    //         this.setState({ isLoggedIn: AppState.isLoggedIn, user: AppState });

    //         if (AppState.isLoggedIn) {
    //             window.location = "/dashboard";
    //         }
    //     }
    // }

    render() {
        return (
            <div className="landing-page">
                <Navbar className="container landing-nav">
                    <Navbar.Brand href="/">
                        Open Ride
                    </Navbar.Brand>
                    <Nav
                        activeKey="/"
                        className="me-auto"
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="link-1">Sign up</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="link-2">Log in</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="register-driver">
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

                </Navbar>

                <div className="top-banner full-width">
                    <div className="bg-overlay d-flex">
                        <div className="container landing-caption d-flex flex-column justify-content-center h-100">
                            <h5 className="text-uppercase">
                                <strong>Affordable fast ride</strong>
                            </h5>

                            <p className="text-wrap">Do you want a taxi, or a private car,
                            or perhaps you want a car to move your luggages. <br/> Maybe you want
                            to order a ride, for special purposes just sign up.
                            </p>

                            <div>
                                <button type="button" className="btn btn-dark rounded">
                                    <a href="/register" className="p-lg-3 text-white text-decoration-none">
                                        Ride
                                    </a>
                                </button>

                            </div>
                        </div>
                        <div className="fancy-outer">
                            <div className="fancy-background"></div>
                        </div>
                        <div className="fancy-background-2"></div>
                        <div className="landing_phone">
                            <img src="images/landing_phone.png" alt="phone with map" />
                        </div>
                    </div>
                </div>
                <div className="landing-driver-banner">
                    <div className="landing-driver-banner container d-flex flex-row justify-content-center">

                        <div className="p-4  align-self-center">
                            <h2 className="text-white">Make money on Open Ride</h2>
                            <p className="text-white">Are u a driver or a car owner, start making money on Open Ride</p>
                        </div>
                        
                        <div className="p-4 align-self-center">
                            <button type="button" className="btn btn-light rounded-0 p-3">
                                <a href="/register" 
                                className="text-black pe-2 ps-2 fw-bold text-decoration-none text-uppercase">
                                    Get Started
                                </a>
                            </button>
                        </div>


                    </div>
                </div>

                <Container className="mb-3 mt-5 pt-5">
                    <Row className="mb-5 ">
                        <Col lg={4} md="auto" sm={12}>
                            <Card className="text-center mb-3">
                                <h4>Take Open Ride with you</h4>
                                Open Ride comes with mobile and desktop apps
                                
                                <img alt="create-account" src="/images/create-account.png" />
                                
                            </Card>
                        </Col>

                        <Col lg={4} md="auto" sm={12}>
                            <Card className="text-center mb-3">
                                <h4>Get a ride within seconds</h4>
                                Getting the right driver is made easier with OR
                                <Card.Body>
                                    <Card.Img variant="top" src="/images/student-search.jpg" />
                                </Card.Body>
                                
                                
                            </Card>
                        </Col>

                        <Col lg={4} md="auto" sm={12}>
                            <Card className="text-center mb-3">
                                <h4>Priority on the user</h4>
                                All your transport problem, solved
                                <Card.Body>
                                    <Card.Img variant="top" src="/images/reserved.png" />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                   </Container>


            </div>
        );
    }
}

export default Landing;
