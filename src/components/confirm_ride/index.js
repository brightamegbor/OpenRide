/* eslint-disable react/prop-types */

import React, { useContext } from 'react';
import Context from '../../Context';
// import { useHistory } from 'react-router-dom';
import { updateRideDB } from '../../services/firebaseUtils';
import { Button } from "@mui/material";
import ComfortImage from "../../assets/images/category-comfort.png";
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import PersonIcon from '@mui/icons-material/Person';

function ConfirmRide(props) { 
  // user, 
  const { isDriver, currentRide } = props;

  const { setCurrentRide, setIsLoading } = useContext(Context);

  // const history = useHistory();

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
  // const finishRide = () => {
  //   const isFinish = window.confirm('Do you want to finish this ride?');
  //   if (isFinish) {
  //     // update data on Firebase.
  //     currentRide.status = 2;
  //     updateRide(currentRide);
  //   }
  // };

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
      <div className="d-flex flex-row justify-content-between bg-success bg-opacity-10 ps-3 pe-3 pt-2 override-mg">
        <div className='d-flex flex-row'>
          <img width={70} height={40} src={ComfortImage} alt="category_comfort" />
          <p className='p-4'></p>
          <div className='d-flex flex-column'>
              <p className="fw-bolder mb-0"><span>Standard </span><InfoOutlined fontSize='10px' /></p>
              <p className="mb-1"><PersonIcon fontSize='10px' /> 4 seats</p>
          </div>
        </div>
        <p className="fw-bolder">{currentRide.price}</p>
      </div>
      <div className="ride-detail__actions">
        <p className='p-2'></p>
        {/* <p className="ride-detail__result-label"><span>To: </span>{currentRide.destination && currentRide.destination.label ? currentRide.destination.label : ''}</p> */}
        {/* <button className="ride-detail__btn" onClick={talkToUser}>{isDriver ? 'Talk to User' : 'Talk to Driver'}</button> */}
        <Button variant="contained" color='error' className="text-capitalize rounded-pill" onClick={cancelRide}>Cancel The Ride</Button>
        {(!isDriver && currentRide.status === 3) && <Button variant="contained" color='success' className="ms-4 text-capitalize rounded-pill" onClick={confirmRideDriver}>Select Standard</Button>}
      </div>
    </div>
  );
}

export default ConfirmRide;