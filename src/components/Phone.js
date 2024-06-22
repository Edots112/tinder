import React, { useEffect, useState } from 'react';
import Swipper from './Swipper';
import Loading from './Loading';
import Welcome from './Welcome';
import Form from './Form';

const Phone = () => {
	const [currentStep, setCurrentStep] = useState('initial');

	useEffect(() => {
		const tinderIcon = document.querySelector(".move");
		const whiteScreen = document.querySelector(".white");
		const closeButton = document.querySelector(".close");

		const openApp = () => {
			whiteScreen.classList.add("active");
			setTimeout(() => {
				setCurrentStep('welcome');
			}, 3000); // Show the welcome page after 3 seconds
		};

		const closeApp = () => {
			whiteScreen.classList.remove("active");
			setCurrentStep('initial');
		};

		tinderIcon.addEventListener("click", openApp);
		closeButton.addEventListener("click", closeApp);

		return () => {
			tinderIcon.removeEventListener("click", openApp);
			closeButton.removeEventListener("click", closeApp);
		};
	}, []);

	

	return (
		<div className="center">
			<img src={`${process.env.PUBLIC_URL}/img/iphone.png`} height="500px" alt="iphone" />
			<div className="move">
				<img src={`${process.env.PUBLIC_URL}/img/tinder.jpg`} alt="tinder" className="tinder" />
				<p>Tinder</p>
			</div>
			<div className='x-div'>
				<img src={`${process.env.PUBLIC_URL}/img/X_icon.svg`} alt="x" className="x" />
				<p>X</p>
			</div>
			<div className='tel-div'>
				<img src={`${process.env.PUBLIC_URL}/img/telegram.jpg`} alt="telegram" className="telegram" />
				<p>Telegram</p>
			</div>
			<div className='pump-div'>
				<img src={`${process.env.PUBLIC_URL}/img/pumpfun.png`} alt="pumpfun" className="pumpfun" />
				<p>Pump.fun</p>
			</div>
			<div className="white">
				<div className="close">
					<div style={{ position: 'relative', left: '5px' }}>&times;</div>
				</div>
				{currentStep === 'initial' && <Loading/>}
				{currentStep === 'swipper' && <Swipper setCurrentStep={setCurrentStep} />}
				{currentStep === 'welcome' && <Welcome setCurrentStep={setCurrentStep}/>}
				{currentStep === 'form' && <Form setCurrentStep={setCurrentStep}/>}
			</div>
		</div>
	);
};

export default Phone;
