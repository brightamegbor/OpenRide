import './App.css';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import Routes from './routes';
import Context from './Context';
import { createdRideUtil, currentRideUtil } from './services/firebaseUtils';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  // user state contains authenticated user.
  const [user, setUser] = useState(null);
  // comet chat.
  // selected from, selected to.
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  // created ride request.
  const [rideRequest, setRideRequest] = useState(null);
  // current ride.
  const [currentRide, setCurrentRide] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const lookingDriverMaxTime = 30000;

  useEffect(() => {
    // initAuthUser();
    initCurrentRide();
  }, []);

  useEffect(() => {
    if (rideRequest) {
      // create a timeout to trigger notification if there is no driver.
      const lookingDriverTimeout = setTimeout(() => {
        alert('Cannot find your driver, please re-enter your pickup location and try again');
        // remove the created ride.
        setRideRequest(null);
        // hide loading indicator.
        setIsLoading(false);
      }, lookingDriverMaxTime);
      // show loading indicator.
      setIsLoading(true);
      // check data changes from firebase real time database. If there is a driver accepted the request.
      createdRideUtil(rideRequest).then((updatedRide) => {
        if(updatedRide && updatedRide.rideUuid === rideRequest.rideUuid && updatedRide.driver) {
          // hide loading indicator.
          setIsLoading(false);
          // remove looking for driver timeout.
          clearTimeout(lookingDriverTimeout);
          // set rider request and created ride.
          setRideRequest(null);
          // set created ride.
          localStorage.setItem('currentRide', JSON.stringify(updatedRide));
          // set current Ride. 
          setCurrentRide(() => updatedRide);
        }
      })
    }
  }, [rideRequest]);

  useEffect(() => {
    if (currentRide) {
      currentRideUtil(currentRide).then((val) => {
        if(val === true) {
          // remove data from context.
          setCurrentRide(null);
          // reload window 
          window.location.reload();
        }
      })
    }
  }, [currentRide]);

  /**
   * init current ride
   */
  const initCurrentRide = () => {
    const currentRide = localStorage.getItem('currentRide');
    if (currentRide) { 
      setCurrentRide(() => JSON.parse(currentRide));
    }
  }

  /**
   * init auth user
   */
  // const initAuthUser = () => { 
  //   const authenticatedUser = localStorage.getItem('auth');
  //   if (authenticatedUser) { 
  //     setUser(JSON.parse(authenticatedUser));
  //   }
  // };

    return (
      <Context.Provider value={{isLoading, setIsLoading, user, setUser, selectedFrom, setSelectedFrom, selectedTo, setSelectedTo, rideRequest, setRideRequest, currentRide, setCurrentRide}}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      
      </Context.Provider>
    );
}

export default App;
