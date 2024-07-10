import React, { useEffect, useState } from "react";
import Swipper from "./Swipper";
import Loading from "./Loading";
import Welcome from "./Welcome";
import Form from "./Form";
import PasscodeScreen from "./PasscodeScreen";
import CameraOverlay from "./CameraOverlay";

const Phone = () => {
	const [currentStep, setCurrentStep] = useState("initial");
	const [fade, setFade] = useState(false);
	const [isLocked, setIsLocked] = useState(true);
	const [isUnlocking, setIsUnlocking] = useState(false);
	const [lockSound] = useState(new Audio(`${process.env.PUBLIC_URL}/sounds/lock.mp3`));

	useEffect(() => {
		lockSound.load();
	}, [lockSound]);

	useEffect(() => {
		const tinderIcon = document.querySelector(".move");
		const whiteScreen = document.querySelector(".white");
		const closeButton = document.querySelector(".close");

		const openApp = () => {
			if (isLocked) return;
			whiteScreen.classList.add("active");
			setTimeout(() => {
				setFade(true);
				setTimeout(() => {
					setCurrentStep("welcome");
					setFade(false);
				}, 500);
			}, 3000);
		};

		const closeApp = () => {
			whiteScreen.classList.remove("active");
			setTimeout(() => {
				setFade(true);
				setTimeout(() => {
					setCurrentStep("initial");
					setFade(false);
				}, 500);
			}, 500);
		};

		tinderIcon.addEventListener("click", openApp);
		closeButton.addEventListener("click", closeApp);

		return () => {
			tinderIcon.removeEventListener("click", openApp);
			closeButton.removeEventListener("click", closeApp);
		};
	}, [isLocked]);

	const changeCurrentState = (state) => {
		setTimeout(() => {
			setFade(true);
			setTimeout(() => {
				setCurrentStep(state);
				setFade(false);
			}, 250);
		}, 250);
	};

	const handleUnlock = () => {
		setIsUnlocking(true);
		setTimeout(() => {
			setIsLocked(false);
			setIsUnlocking(false);
		}, 500); // This should match the transition duration in CSS
	};

	const handleLock = () => {
		lockSound.play();
	};

	return (
		<div className="center">
			<img src={`${process.env.PUBLIC_URL}/img/iphone.png`} height="800px" alt="iphone" />
			<CameraOverlay />
			<div className="move">
				<img src={`${process.env.PUBLIC_URL}/img/tinder.jpg`} alt="tinder" className="tinder" />
				<p>Tinder</p>
			</div>
			<div className="x-div">
				<img src={`${process.env.PUBLIC_URL}/img/X_icon.svg`} alt="x" className="x" />
				<p>X</p>
			</div>
			<div className="tel-div">
				<img src={`${process.env.PUBLIC_URL}/img/telegram.jpg`} alt="telegram" className="telegram" />
				<p>Telegram</p>
			</div>
			<div className="pump-div">
				<img src={`${process.env.PUBLIC_URL}/img/pumpfun.png`} alt="pumpfun" className="pumpfun" />
				<p>Pump.fun</p>
			</div>
			<div className="white">
				<div className="close" onClick={handleLock}>
					<div style={{ position: "relative", left: "5px" }}>&times;</div>
				</div>
				<div className={`fade ${fade ? "fade-out" : ""}`}>
					{currentStep === "initial" && <Loading />}
					{currentStep === "swipper" && <Swipper setCurrentStep={changeCurrentState} />}
					{currentStep === "welcome" && <Welcome setCurrentStep={changeCurrentState} />}
					{currentStep === "form" && <Form setCurrentStep={changeCurrentState} />}
				</div>
			</div>
			{(isLocked || isUnlocking) && <PasscodeScreen onUnlock={handleUnlock} />}
		</div>
	);
};

export default Phone;
