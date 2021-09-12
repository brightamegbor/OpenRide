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

                <div className="container mt-4 pt-4 text-center">
                    <h3 className="separator">
                        Welcome to Housing
                    </h3>
                    <p className="mt-5">How it works?</p>

                    <h5 className="m-5">FOR STUDENTS</h5>
                </div>

                <Container className="mb-3">
                    <Row className="mb-5">
                        <Col lg={4} md="auto" sm={12}>
                            <Card className="text-center mb-3">
                                <Card.Header>1. Create an account</Card.Header>
                                <Card.Body>
                                    {/* <Card.Img variant="top" src="/img/create-account.png" /> */}

                                    <button type="button" className="btn btn-primary rounded">
                                        <a href="/register" className="text-white text-decoration-none">
                                            Sign up
                                        </a>
                                    </button>
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    It`&apos;`s actually free to create an account
                                </Card.Footer>
                            </Card>
                        </Col>

                        <Col lg={4} md="auto" sm={12}>
                            <Card className="text-center mb-3">
                                <Card.Header>2. Search for an apartment</Card.Header>
                                <Card.Body>
                                    {/* <Card.Img variant="top" src="/img/student-search.jpg" /> */}
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    Search for apartments based on location and price
                                </Card.Footer>
                            </Card>
                        </Col>

                        <Col lg={4} md="auto" sm={12}>
                            <Card className="text-center mb-3">
                                <Card.Header>3. Reserved your apartment</Card.Header>
                                <Card.Body>
                                    {/* <Card.Img variant="top" src="/img/reserved.png" /> */}
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    Contact the lessor and arrange for reservation awaiting your arrival
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>

                    <h5 className="m-5 pt-3 text-center">
                        FOR HOUSE HOLDERS</h5>
                    <Row>
                        <Col lg={4} md="auto" sm={12}>
                            <Card className="text-center mb-3">
                                <Card.Header>1. Create an account</Card.Header>
                                <Card.Body>
                                    {/* <Card.Img variant="top" src="/img/create-account.png" /> */}
                                    <button type="button" className="btn btn-primary rounded">
                                        <a href="/register" className="text-white text-decoration-none">
                                            Sign up
                                        </a>
                                    </button>
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    It`&apos;`s actually free to create an account
                                </Card.Footer>
                            </Card>
                        </Col>

                        <Col lg={4} md="auto" sm={12}>
                            <Card className="text-center mb-3">
                                <Card.Header>2. Add your apartment</Card.Header>
                                <Card.Body>
                                    {/* <Card.Img variant="top" src="/img/add-apartment.png" /> */}
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    Add your apartment listing, including location and other details
                                </Card.Footer>
                            </Card>
                        </Col>

                        <Col lg={4} md="auto" sm={12}>
                            <Card className="text-center mb-3">
                                <Card.Header>3. Activate your listing</Card.Header>
                                <Card.Body>
                                    {/* <Card.Img variant="top" src="/img/activate-apartment.png" /> */}
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    Wait for approval and your apartment will be live in no time
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </Container>


            </div>
        );
    }
}

export default Landing;
