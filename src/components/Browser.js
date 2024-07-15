import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Added faTimes for cross button

const Browser = ({setIsBrowser}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsBrowser(false), 300);
  };

  return (
    <div className={`browser ${isVisible ? 'show' : 'hide'}`}>
      <button className="close-button-top-right" style={{color: 'white'}} onClick={handleClose}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <iframe className='iframe'
        title="Pump Fun"
        src="https://pump.fun"
        style={{ width: '100%', height: '100%', border: 'none', borderRadius: '55px' }}
      />
    </div>
  );
};

export default Browser;
