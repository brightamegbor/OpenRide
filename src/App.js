import './App.css';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Component } from 'react';
import Routes from './routes';

class App extends Component {
  render() {
    return (
      <BrowserRouter >
        <Routes />
      </BrowserRouter>
    );

  }
}

export default App;
