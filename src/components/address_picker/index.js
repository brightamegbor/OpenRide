/* eslint-disable react/prop-types */
import React, { Fragment, useState, useEffect, 
  useRef, useContext, useCallback } from "react";
import Box from '@mui/material/Box';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
// import '../../index.css';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField'; 
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import ClosedOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Context from '../../Context';
import RequestRide from '../request_ride';
import withModal from '../modal';


function AddressPickerForm(props) {
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [myLocValue, setMyLocValue] = useState("");
  const [destLocValue, setDestLocValue] = useState("");
  const [myLocValueActive, setmyLocValueActive] = useState(false);
  
  const { selectedFrom, setSelectedFrom, selectedTo, setSelectedTo, setwhereToHeight } = useContext(Context);

  const opsProvider = useRef();
  const myLocationRef = useRef();
  const destinationRef = useRef();

  const { toggleModal } = props;

  const fetchAdd = async () => {
      var lat = 5.10535;
      var lng = -1.2466;

      navigator.geolocation.getCurrentPosition(
          (position) => {
              // this.setState({
              lng = position.coords.longitude;
              lat = position.coords.latitude;

              // console.log(lng);

              const nominatimURL = "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + lng + "&zoom=14";
              // fetch lat and long and use it with leaflet
              fetch(nominatimURL)
                  .then(response => response.json())
                  .then(async data => {
                      await setMyLocValue(data.address.city !== undefined ? data.address.city : data.address.town);
                      myLocationRef.current.value = data.address.city !== undefined ? data.address.city : data.address.town;
                      // console.log(data.address.city !== undefined ? data.address.city : data.address.town);
                  })
              // });
          },
          err => console.log(err)
      )
      
  }

  useEffect(() => {
      opsProvider.current = new OpenStreetMapProvider({
          params: {
              'accept-language': 'en',
              countrycodes: "gh"
          }
      });

      fetchAdd();
      
  }, []);

  const shouldRequestDriver = useCallback( () => { 
    if (selectedFrom && selectedTo) {
      // show confirmation dialog to request a driver.
      toggleModal(true);
    }
  }, [selectedFrom, selectedTo, toggleModal]);

  useEffect(() => {
    if (selectedFrom && selectedTo) {
      // check a driver should be requested, or not.
      shouldRequestDriver();
    }
  }, [selectedFrom, selectedTo, shouldRequestDriver]);

  const fetchAddrSuggestions = (e) => {

      var input = e.target.value;

      opsProvider.current.search({ query: input}).then(async (results) => {
          // console.log(results);
          await setAddressSuggestions([]);
          await setAddressSuggestions(results);
      });
  }

  const locationSelected = (selectedLocation) => {

    if (selectedLocation && selectedLocation.label && selectedLocation.x && selectedLocation.y) {
        if (myLocValueActive) {
            // set pick up location.
            setMyLocValue(() => selectedLocation.label);
            setSelectedFrom(() => selectedLocation);
          } else {
            // set destination.
            setDestLocValue(() => selectedLocation.label);
            setSelectedTo(() => selectedLocation);
            setAddressSuggestions(() => []);
          }
    }
  }

  return (
      <Fragment>
          <p className="pt-1"></p>
          <ClosedOutlinedIcon className="float-start" onClick={() => setwhereToHeight(40)} />
          <p className="fw-bold text-center">Select location</p>
          <p className="pt-1"></p>

          <Autocomplete
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              // noOptionsText={'No location found'}
              options={[]}
              // getOptionLabel={(option) => option.label}
              inputValue={myLocValue}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      label="Pick-up location"
                      variant="filled"
                      InputProps={{
                          ...params.InputProps,
                          type: 'search',
                          endAdornment: (
                              <Box sx={{ display: 'flex', alignSelf: 'baseline' }}>
                                  {(myLocValue.length !== 0 && myLocationRef.current === document.activeElement) && <ClosedOutlinedIcon onClick={() => setMyLocValue("")} />}
                              </Box>
                          ),
                      }}
                      onChange={(event) => {
                          setMyLocValue(event.target.value);
                          return fetchAddrSuggestions(event, {inputName: "my"});
                      }}
                      onFocus={() => {
                          setmyLocValueActive(true);
                      }}
                      // value={myLocValue}
                      inputRef={myLocationRef}
                  />
              )}
          />

          <p className="pt-2"></p>
          <Autocomplete
              freeSolo
              id="free-solo-1-demo"
              disableClearable
              // clearOnBlur
              // noOptionsText={'No location found'}
              options={[]}
              // getOptionLabel={(option) => option.label}
              inputValue={destLocValue}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      label="Search destination"
                      variant="filled"
                      InputProps={{
                          ...params.InputProps,
                          type: 'search',
                          endAdornment: (
                              <Box sx={{ display: 'flex', alignSelf: 'baseline' }}>
                                  {(destLocValue.length !== 0 && destinationRef.current === document.activeElement) && <ClosedOutlinedIcon onClick={() => setDestLocValue("")} />}
                              </Box>
                          ),
                      }}
                      onChange={(e) => {
                          setDestLocValue(e.target.value);
                          return fetchAddrSuggestions(e, { inputName: "dest" });
                      }}
                      onFocus={() => {
                          setmyLocValueActive(false);
                      }}
                      ref={destinationRef}
                  />
              )}
          />

          <p className="pt-1"></p>

          <p className="pt-1"></p>
          <div>{addressSuggestions.map((suggest, index) => (
              <li key={index} className="list-unstyled" onClick={() => locationSelected(suggest)}>
                  <p><LocationOnOutlinedIcon /> {suggest.label}</p>
              </li>
          ))}</div>

          <p className="pt-1"></p>
          {addressSuggestions.length !== 0 && 
              <p>
                  Data © OpenStreetMap contributors, ODbL 1.0. <a href="https://osm.org/copyright" target="_blank" rel="noreferrer">
                       https://osm.org/copyright
                  </a>
              </p>
          }
      </Fragment>
  );
}

export default withModal(RequestRide)(AddressPickerForm);
