import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPhone, faBackspace, faPhoneAlt, faPhoneSlash, faPhoneSquareAlt, faTimes } from '@fortawesome/free-solid-svg-icons'; // Added faTimes for cross button
import '../DialScreen.css';

const DialScreen = ({ setIsCall }) => {
  const [number, setNumber] = useState('');
  const [screen, setScreen] = useState('keypad');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const handleKeyPress = (key) => {
    setNumber((prevNumber) => prevNumber + key);
  };

  const handleBackspace = () => {
    setNumber((prevNumber) => prevNumber.slice(0, -1));
  };

  const handleCall = () => {
    alert(`Calling ${number}`);
    setNumber('');
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsCall(false), 300); // Delay setting isCall to false to allow for fade out
  };

  const renderKeypad = () => (
    <>
      <div className="display">
        <div className="number">{number}</div>
        <button className="backspace" onClick={handleBackspace}>
          <FontAwesomeIcon icon={faBackspace} />
        </button>
      </div>
      <div className="keypad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
          <button className="key" key={key} onClick={() => handleKeyPress(key)}>
            {key}
          </button>
        ))}
      </div>
      <button className="call-button" onClick={handleCall}>
        <FontAwesomeIcon icon={faPhoneAlt} />
      </button>
    </>
  );

  const renderRecents = () => (
    <div className="recents">
      {[
        { name: 'Pizza Guy', number: '123-456-7890', time: 'Yesterday', type: 'missed' },
        { name: 'Meme Lord', number: '987-654-3210', time: '2 days ago', type: 'call' },
        { name: 'Ghostbuster', number: '555-123-4567', time: 'Last week', type: 'call' },
        { name: 'Space Cowboy', number: '111-222-3333', time: '2 weeks ago', type: 'missed' },
        { name: 'Darth Vader', number: '999-888-7777', time: 'Last month', type: 'call' },
        { name: 'Doctor Strange', number: '444-555-6666', time: '3 months ago', type: 'missed' },
        { name: 'Yoda', number: '777-888-9999', time: '6 months ago', type: 'call' },
        { name: 'Spider-Man', number: '555-777-8888', time: 'Yesterday', type: 'call' },
        { name: 'Wonder Woman', number: '222-333-4444', time: 'Last week', type: 'missed' },
        { name: 'Iron Man', number: '888-999-0000', time: '2 weeks ago', type: 'call' },
        { name: 'Black Widow', number: '111-222-3333', time: '2 months ago', type: 'missed' }        
      ].map((call, index) => (
        <div className="recent-call" key={index}>
          <div style={{ width: '20px' }}>
            {(call.type === 'missed') ? (
              <FontAwesomeIcon icon={faPhoneSlash} style={{ color: 'red', width: '20px' }} className="call-icon" />
            ) : (
              <FontAwesomeIcon icon={faPhoneSquareAlt} style={{ color: 'green', width: '20px' }} className="call-icon" />
            )}
          </div>
          <div className="recent-call-info">
            <span className="recent-call-name">{call.name}</span>
            <span className="recent-call-number">{call.number}</span>
          </div>
          <span className="recent-call-time">{call.time}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`dial-screen ${isVisible ? 'show' : 'hide'}`}>
      <button className="close-button-top-right" onClick={handleClose}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
      {screen === 'keypad' ? renderKeypad() : renderRecents()}
      <div className="actions">
        <button className="action" onClick={() => setScreen('recents')}>
          <FontAwesomeIcon icon={faClock} />
          <span>Recents</span>
        </button>
        <button className="action" onClick={() => setScreen('keypad')}>
          <FontAwesomeIcon icon={faPhone} />
          <span>Keypad</span>
        </button>
      </div>
    </div>
  );
};

export default DialScreen;
