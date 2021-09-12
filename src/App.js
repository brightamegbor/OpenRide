import './App.css';
import Landing from './landing/landing';
import { Router, Route, Switch, withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import NavBar from './components/nav/navbar';
import { Component } from 'react';
import history from './services/history';
// import { Navbar } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <Router history={history}>
        {/* <NavBar /> */}
        <Landing />
      </Router>
    );

  }
}

export default App;
