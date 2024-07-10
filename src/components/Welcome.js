import React from "react";

const Welcome = (props) => {
	const handleGetStarted = () => {
		if (localStorage.getItem("name")) {
			props.setCurrentStep("swipper");
		} else {
			props.setCurrentStep("form");
		}
	};

	return (
		<div className="welcome-page">
			<img
				src={`${process.env.PUBLIC_URL}/img/tinder.jpg`}
				alt="logo"
				width="100px"
				style={{
					position: "relative",
					left: "0px",
					borderRadius: "20px",
				}}
			/>
			<h1>Welcome!</h1>
			<p>We are happy to get you on board!. Lets get started</p>
			<button style={{ cursor: "pointer" }} onClick={handleGetStarted}>
				Get Started
			</button>
		</div>
	);
};

export default Welcome;
