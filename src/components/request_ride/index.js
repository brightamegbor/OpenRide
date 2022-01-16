/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { v4 as uuidv4 } from "uuid";
import { createRideDB } from '../../services/firebaseUtils';
import Context from '../../Context';
import { Button } from "@mui/material";

function RequestRide(props) {
  // get toggleModal functin from higher order components.
  const { toggleModal } = props;

  const { user, selectedFrom, selectedTo, setRideRequest, 
    setIsLoading, setwhereToHeight, distance, price } = useContext(Context);

  /**
   * request a ride
   */
  const requestRide = () => {
    // if (user && selectedFrom && selectedTo) {
    if (selectedFrom && selectedTo) {
      // close the modal.
      toggleModal(false);
      setwhereToHeight(40);
      // show loading indicator. 
      setIsLoading(true);
      // create object.
      const rideUuid = uuidv4();
      const ride = {
        "rideUuid": rideUuid,
        "requestor": user,
        "pickup": selectedFrom,
        "destination": selectedTo,
        "distance": distance,
        "price": `GHS ${price}`,
        "status": 0
      }
      // insert to Firebase realtime database.
      createRideDB(rideUuid, ride).then(() => {
        setRideRequest(ride);
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    }
  };

  return (
    <div className="request-ride">
      <div className="request-ride__content">
        <div className="request-ride__container">
          {/* <div className="request-ride__title">Requesting a Ride</div> */}
          {/* <div className="request-ride__close">
            <img
              alt="close"
              onClick={() => toggleModal(false)}
              src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/__geKiQnSG-.png"
            />
          </div> */}
        </div>
        <div className="request-ride__subtitle"></div>
        <div className="request-ride__form">
          {/* <p>
            You entered the pickup location successfully. Do you want to request a ride now ?
          </p>
          <button className="request-ride__btn request-ride__change-btn" onClick={() => toggleModal(false)}>
            Change
          </button>
          <button className="request-ride__btn" onClick={requestRide}>
            Requesting a ride now
          </button> */}
          
          
          <Button fullWidth className="p-3 rounded-pill" variant="contained" onClick={requestRide}>
              Get available rides
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RequestRide;
