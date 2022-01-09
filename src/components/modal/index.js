/* eslint-disable react/display-name */
// import use state.
import React, { useState } from 'react';
const withModal = ModalComponent => WrapperComponent => {
  return function () { 
    // state to show / hide custom modal.
    const [isModalShown, setIsModalShown] = useState(false);
    
    return (
      <>
        <WrapperComponent toggleModal={setIsModalShown}/>
        {isModalShown && <ModalComponent toggleModal={setIsModalShown} />}
      </>
    )
  }
}

export default withModal
