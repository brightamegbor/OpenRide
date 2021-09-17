import React, { Component } from 'react';
import './landing.css';
import { Card, Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
import { 
    FaRegQuestionCircle, FaPhoneAlt, FaFacebookSquare,
    FaTwitterSquare, FaLinkedin, FaInstagram
} from "react-icons/fa";
import {
    MdLocationOn
} from "react-icons/md";

class Landing extends Component {
    // state = {};
    constructor(props) {
        super(props)
        this.state = {
            latitude: null,
            longitude: null,
            currentCity: "",
        }
    }
    
    componentDidMount() {
        this.currentLocation();
    }

    componentWillUnmount() {
        
    }

    currentLocation = async () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude
                });
                this.getCityName(
                    position.coords.latitude,
                    position.coords.longitude
                );
            },
            err => console.log(err)
        );
    }

    getCityName = async (latitude, longitude) => {
        var that = this;

        const response = await fetch("https://us1.locationiq.com/v1/reverse.php?key=pk.f23bfccd4ea955650b009b9e1ab35e2b&lat=" +
            latitude + "&lon=" + longitude + "&format=json");
        
        const data = await response.json();
        var city;
        if (data.address.city !== undefined) {
            city = data.address.city;
        } else {
             city = data.address.county;

        }
        console.log(city);
        that.setState({
            currentCity: city,
        });
    }

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

                   <footer className="footer">
                        <Container className="mb-3 mt-5 pt-5">
                            <Row className="mb-5 ps-3 ps-lg-0 ps-xl-0">
                                <Col lg={4} md="auto" sm={12}>
                                    <h2>Open Ride</h2>

                                    <div className="pt-5">
                                    <h6>
                                        <span className="pe-2"><FaRegQuestionCircle /></span> Help Center
                                    </h6>
                                    <h6 className="pt-2 pb-2 pt-lg-0 pt-md-0 pt-xl-0 pt-xxl-0">
                                        <span className="pe-2"><FaPhoneAlt /></span> Contacts
                                    </h6>

                                    </div>
                                </Col>

                                <Col lg={4} md="auto" sm={12}>
                                    <h4 className="pt-4 pt-lg-0 pt-md-0 pt-xl-0 pt-xxl-0">
                                        Products
                                    </h4>

                                    <div className="pt-2">
                                        <p>Ride</p>
                                        <p>Drive</p>
                                        <p>Deliver</p>
                                        <p>Relocator</p>
                                        <p>Errand</p>
                                        <p>Business</p>

                                    </div>
                                </Col>

                                <Col lg={4} md="auto" sm={12}>
                                    <h4 className="pt-4 pt-lg-0 pt-md-0 pt-xl-0 pt-xxl-0">About</h4>

                                    <div className="pt-2">
                                        <p>About us</p>
                                        <p>Investors</p>
                                        <p>Contact us</p>
                                        <p>Newsroom</p>
                                        <p>Open Ride Careers</p>
                                        <p>Blog</p>

                                    </div>
                                </Col>
                            </Row>

                        <div className="d-flex flex-column 
                        flex-xl-row flex-xxl-row flex-lg-row flex-md-row 
                        justify-content-between align-items-center">
                            <div>
                                <p>&copy; {new Date().getFullYear()} Open Ride Inc.</p>
                            </div>

                            <div className="socials">
                                <FaFacebookSquare />
                                <FaTwitterSquare />
                                <FaLinkedin />
                                <FaInstagram />
                            </div>

                            <div className="d-flex flex-lg-row pt-xl-0 pt-xxl-0 pt-md-1
                            flex-sm-column pt-4 pt-lg-0">
                                <p className="pe-4">Privacy</p>
                                <p className="pe-4">Terms</p>
                                <p>
                                    <span className="pe-2"><MdLocationOn /></span>
                                    {this.state.currentCity !== "" && this.state.currentCity}
                                    {this.state.currentCity === "" && "Waiting for location"}
                                </p>
                            </div>

                        </div>
                        </Container>
                   </footer>

            </div>
        );
    }
}

export default Landing;
