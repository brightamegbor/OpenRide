
import React, { useEffect, useState, useContext } from 'react';
import Context from '../../Context';
import { acceptRideDB, getRideList } from '../../services/firebaseUtils';
import { onValue, off } from "firebase/database";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Button } from "@mui/material";

function RideList() {

  const [rideRequests, setRideRequests] = useState();

  const { user, setIsLoading, setCurrentRide, setSelectedFrom, setSelectedTo } = useContext(Context);


  useEffect(() => {
    const rideListQ = getRideList();

    const listener = onValue(rideListQ, (snapshot) => {
      const values = snapshot.val();
      const rides = [];

      if(values) {
          const keys = Object.keys(values);
          if (keys && keys.length !== 0) {
              for (const key of keys) {
                  rides.push(values[key]);
              } 
              setRideRequests(() => rides);
          } else {
            setRideRequests(() => rides);
          }
      } else {
        setRideRequests(() => rides);
      }
  })

  return () => {  off(rideListQ, listener);}
  }, []);

  /**
   * accept ride
   */
  const acceptRide = (request) => {
    // set up driver information for the request.
    request.driver = user;
    request.status = 3;
    // show loading indicator.
    setIsLoading(true);
    acceptRideDB(request).then(() => {
      setIsLoading(false);
      // set created ride.
      localStorage.setItem('currentRide', JSON.stringify(request));
      // set current ride.
      setCurrentRide(() => request);
      // from / to.
      setSelectedFrom(() => request.pickup);
      setSelectedTo(() => request.destination);
    }).catch(() => {
      setIsLoading(false);
    });
  };

  /**
   * confirm ride
   */

  const renderRideList = () => {
    if (rideRequests && rideRequests.length !== 0) {
      return rideRequests.map(request => (
        <div className="ride-list__result-item" key={request.rideUuid}>
          <div className="ride-list__result-icon">
          <LocationOnOutlinedIcon />
          </div>
          <div>
            <p><strong>From: </strong>{request.pickup && request.pickup.label ? request.pickup.label : ''}</p>
            <p><strong>To: </strong>{request.destination && request.destination.label ? request.destination.label : ''}</p>
            <Button className="mb-4" variant="contained" onClick={() => acceptRide(request)}>Accept</Button>
           </div>
        </div>  
      ))
    } else { 
      return (<h3 className="empty-message">You do not have any requests</h3>);
    }
  }

  return (
    <div className="ride-list">
      <div className="ride-list__container">
        <div className="pb-2">Ride Requests</div>
        <div></div>
      </div>
      <div className="ride-list__content">
        {renderRideList()}
      </div>
      <div className="margin-bottom-10">
        <p></p>
        <p></p>
        <p></p>
        <p></p>
      </div>  
    </div>
  );
}

export default RideList;