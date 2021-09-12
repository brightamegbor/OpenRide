import { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

class NavBar extends Component {
    render() {
        return(
            <nav className="navbar fixed-top navbar-dark bg-dark">
                <a className="navbar-brand" href="/">Open Ride</a>
                

            </nav>
        )
    }

}

export default NavBar;
