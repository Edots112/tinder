import React, { useState, useEffect } from "react";
import "../PasscodeScreen.css";
import lock from "../audio/lock.mp3";
import pass from "../audio/pass.mp3";

const PasscodeScreen = ({ onUnlock }) => {
	const [passcode, setPasscode] = useState("");
	const correctPasscode = "1234"; // This should be stored securely in a real app
	const [isUnlocking, setIsUnlocking] = useState(false);
	const [lockSound] = useState(new Audio(lock));
	const [passSound] = useState(new Audio(pass));

	useEffect(() => {
		// Preload sounds
		lockSound.load();
		passSound.load();
	}, [lockSound, passSound]);

	const playLockSound = () => {
		lockSound.currentTime = 0;
		lockSound.play();
	};

	const playPassSound = () => {
		passSound.currentTime = 0;
		passSound.play();
	};

	const handleNumberClick = (number) => {
		playPassSound();
		if (passcode.length < 4 && !isUnlocking) {
			const newPasscode = passcode + number;
			setPasscode(newPasscode);
			if (newPasscode.length === 4) {
				if (newPasscode === correctPasscode) {
					setIsUnlocking(true);
					setTimeout(() => {
						onUnlock();
					}, 500); // 500ms delay before unlocking
				} else {
					// Incorrect passcode
					playLockSound();
					setTimeout(() => setPasscode(""), 300); // Clear after a short delay
				}
			}
		}
	};

	const handleCancelClick = () => {
		playPassSound();
		setPasscode("");
	};

	return (
		<div className={`passcode-screen ${isUnlocking ? "unlocking" : ""}`}>
			<div className="passcode-prompt">Enter Passcode</div>
			<div className="passcode-circles">
				{[...Array(4)].map((_, i) => (
					<div key={i} className={`passcode-circle ${i < passcode.length ? "filled" : ""}`}></div>
				))}
			</div>
			<div className="passcode-keypad">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
					<button key={number} className="passcode-button" onClick={() => handleNumberClick(number)}>
						{number}
					</button>
				))}
				<button className="passcode-button option-button">Emergency</button>
				<button className="passcode-button" onClick={() => handleNumberClick(0)}>
					0
				</button>
				<button className="passcode-button option-button" onClick={handleCancelClick}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default PasscodeScreen;
