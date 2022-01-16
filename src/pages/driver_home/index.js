import React, { useState, useEffect, useRef } from 'react';
import Context from '../../Context';
import { createdRideUtil, currentRideUtil } from '../../services/firebaseUtils';
import DriverDashboard from '../driver_dashboard';
import { onValue } from "firebase/database";

function DriverHome() {
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

  const [whereToHeight, setwhereToHeight] = useState(55);
  const routeControl = useRef();

  // eslint-disable-next-line no-unused-vars
  const lookingDriverMaxTime = 30000;

  useEffect(() => {
    initUser();
    initCurrentRide();
  }, []);

  useEffect(async () => {
    if (rideRequest){
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
      var updatedRide = createdRideUtil(rideRequest);
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
      // })
    }
  }, [rideRequest]);

  useEffect(() => {
    if (currentRide) {
      const currentRideRef = currentRideUtil(currentRide);

      onValue(currentRideRef, (snapshot) => {
        const updatedRide = snapshot.val();
        if (updatedRide && updatedRide.rideUuid === currentRide.rideUuid && updatedRide.driver && (updatedRide.status === -1 || updatedRide.status === 2)) {
            // remove localStorage.
            localStorage.removeItem('currentRide');
            // remove data from context.
            setCurrentRide(null);
            // reload window 
            window.location.reload();

            return true;
        }
      });
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

  const initUser = () => { 
    const authenticatedUser = localStorage.getItem('UserDetails');
    if (authenticatedUser) { 
      setUser(JSON.parse(authenticatedUser));
    }
  };

  return (
    <Context.Provider value={{isLoading, setIsLoading, user, setUser, selectedFrom, setSelectedFrom, selectedTo, setSelectedTo, 
    rideRequest, setRideRequest, currentRide, setCurrentRide, whereToHeight, setwhereToHeight, routeControl}}>
        <DriverDashboard />
    </Context.Provider>
  )
}

export default DriverHome
