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
    setIsLoading, setwhereToHeight, distance, price, time } = useContext(Context);

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
        "time": time,
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
      <div>
        <Button fullWidth className="p-3 rounded-pill" variant="contained" onClick={requestRide}>
            Get available rides
        </Button>
      </div>
  );
}

export default RequestRide;
