/* eslint-disable react/prop-types */

import React, { useContext, useEffect, useState } from 'react';
import Context from '../../Context';
// import { useHistory } from 'react-router-dom';
import { currentRideUtil, updateRideDB } from '../../services/firebaseUtils';
import { Button } from "@mui/material";
import { off, onValue } from 'firebase/database';

function RideDetail(props) { 
  const { user, isDriver, currentRide } = props;

  const { setCurrentRide, setIsLoading } = useContext(Context);

  const [driverConfirm, setDriverConfirm] = useState(false);

  useEffect(() => {
    const rideListQ = currentRideUtil(currentRide);

    const listener = onValue(rideListQ, (snapshot) => {
      const value = snapshot.val();

      if (value && value.rideUuid === currentRide.rideUuid && value.status === 5) {
        localStorage.setItem('currentRide', JSON.stringify(value));

        setDriverConfirm(true);

        setCurrentRide(value);
      }
  })

  return () => {  off(rideListQ, listener);}
  }, []);

  /**
   * remove ride from storage and context
   */
  const removeRideFromStorageAndContext = () => {
    // remove localStorage.
    localStorage.removeItem('currentRide');
    // remove data from context.
    setCurrentRide(null);
    // reload window 
    window.location.reload();
  }

  const updateRide = (ride) => { 
    // show loading indicator.
    setIsLoading(true);
    // update data on Firebase.
    updateRideDB(ride).then(() => {
      setIsLoading(false);
      removeRideFromStorageAndContext();
    }).catch(() => {
      setIsLoading(false);
    });
  }

  /**
   * cancel ride
   */
  const cancelRide = () => {
    const isCancel = window.confirm('Do you want to cancel this ride?');
    if (isCancel) {
      // update data on Firebase.
      currentRide.status = -1;
      updateRide(currentRide);
    }
  };

  /**
   * finish ride
   */
  const finishRide = () => {
    const isFinish = window.confirm('Do you want to finish this ride?');
    if (isFinish) {
      // update data on Firebase.
      currentRide.status = 2;
      updateRide(currentRide);
    }
  };

  /**
   * finish ride
   */
  const confirmRideDriver = () => {
    const isConfirm = window.confirm('Confirm ride?');
    if (isConfirm) {
      // update data on Firebase.
      currentRide.status = 1;
      // show loading indicator.
      setIsLoading(true);
      // update data on Firebase.
      updateRideDB(currentRide).then(() => {
        setIsLoading(false);
        setCurrentRide(currentRide);
        localStorage.setItem('currentRide', JSON.stringify(currentRide));
      }).catch(() => {
        setIsLoading(false);
      });
    }
  };

  /**
   * talk to user
   */
  // const talkToUser = () => {
  //   history.push('/chat');
  // };

  return (
    <div className="ride-detail">
      <div className="ride-detail__user-avatar">
        <img width={60} height={70} src={user.profile_photo} alt={user.email} />
      </div>
      <p className="ride-detail__user-info">{user.email} - {user.mobileNumber}</p>
      <div className="ride-detail__actions">
        <p className="ride-detail__result-label"><span>From: </span>{currentRide.pickup && currentRide.pickup.label ? currentRide.pickup.label : ''}</p>
        <p className="ride-detail__result-label"><span>To: </span>{currentRide.destination && currentRide.destination.label ? currentRide.destination.label : ''}</p>
        {/* <button className="ride-detail__btn" onClick={talkToUser}>{isDriver ? 'Talk to User' : 'Talk to Driver'}</button> */}
        <Button variant="contained" color='error' onClick={cancelRide}>Cancel the Ride</Button>
        {(isDriver && currentRide.status === 1) && <Button variant="contained" color='success' className="ms-4" onClick={finishRide}>Finish the Ride</Button>}
        {(isDriver && driverConfirm && currentRide.status === 5) && <Button variant="contained" color='success' className="ms-4" onClick={confirmRideDriver}>Confirm ride</Button>}
      </div>
    </div>
  );
}

export default RideDetail;