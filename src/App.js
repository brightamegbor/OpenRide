import './App.css';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Routes from './routes';

function App() {

    return (
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
      
    );
}

export default App;
