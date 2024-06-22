import React, { useState, useMemo, useRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import Chat from './Chat'; // Import the Chat component

let db = [
	{
		name: 'Richard Hendricks',
		url: '/img/richard.jpg'
	},
	{
		name: 'Erlich Bachman',
		url: '/img/erlich.jpg'
	},
	{
		name: 'Monica Hall',
		url: '/img/monica.jpg'
	},
	{
		name: 'Jared Dunn',
		url: '/img/jared.jpg'
	},
	{
		name: 'Dinesh Chugtai',
		url: '/img/dinesh.jpg'
	}
];

function Swipper({ setCurrentStep }) {

	const [currentIndex, setCurrentIndex] = useState(() => {
		const storedIndex = localStorage.getItem('currentIndex');
		return storedIndex !== null ? parseInt(storedIndex, 10) : db.length - 1;
	});
	const [lastDirection, setLastDirection] = useState(null);
	const [chatPartner, setChatPartner] = useState(null); // State to store the matched chat partner
	const [showChat, setShowChat] = useState(false); // State to toggle chat display
	const [chatMessages, setChatMessages] = useState([]);
	const [matchNotification, setMatchNotification] = useState(false); // State for match notification

	const currentIndexRef = useRef(currentIndex);
	const childRefs = useMemo(
		() =>
			Array(db.length)
				.fill(0)
				.map((_, index) => React.createRef()),
		[]
	);

	// Update localStorage whenever currentIndex changes
	useEffect(() => {
		localStorage.setItem('currentIndex', currentIndex);
	}, [currentIndex]);

	const updateCurrentIndex = (val) => {
		setCurrentIndex(val);
		currentIndexRef.current = val;
	};

	const canGoBack = currentIndex < db.length - 1;

	const swiped = (direction, nameToDelete, index) => {
		setLastDirection(direction);
		updateCurrentIndex(index - 1);

		// Simulate a match and show notification
		if (direction === 'right') {
			if (Math.random() < 0.3) {
				const matchedUser = db[index];
				setChatPartner(matchedUser); // Set the chat partner upon match
				setMatchNotification(true); // Show match notification
			}
		}
	};

	const outOfFrame = (name, idx) => {
		console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
		currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
	};

	const handleSendMessage = (message) => {
		const newMessage = { text: message, fromMe: true };
		setChatMessages([...chatMessages, newMessage]);
	};

	const enterChat = () => {
		setShowChat(true); // Show the chat interface
		setMatchNotification(false); // Hide match notification
	};

	const goBack = async () => {
		if (!canGoBack) return;
		const newIndex = currentIndex + 1;
		updateCurrentIndex(newIndex);
		await childRefs[newIndex].current.restoreCard();
		setChatPartner(null); // Clear chat partner state
		setChatMessages([]); // Clear chat messages
		setShowChat(false); // Hide the chat interface
		setMatchNotification(false); // Hide match notification
	};

	return (
		<div>
			<link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
			<link href='https://fonts.googleapis.com/css?family=Alatsi&display=swap' rel='stylesheet' />

			{matchNotification && (
				<div className='notification'>
					<div className='match-top'><p>You matched with {chatPartner.name}!</p>
						<button className="closeButton" onClick={() => setMatchNotification(false)}>X</button>

					</div>
					<button className='startChat' onClick={enterChat}>Start Chat</button></div>
			)}

			{!showChat ? (
				<>
					<div className='cardContainer'>
						<h4 style={{ margin: '0', position: 'relative', top: '25px', left: '90px', width: 'fit-content' }}>Tinder</h4>
						<img src={`${process.env.PUBLIC_URL}/img/tinder.jpg`} alt='logo' width='30px' style={{ position: 'relative', left: '-100px', borderRadius: '20px' }} />

						{db.map((character, index) => (
							<TinderCard
								ref={childRefs[index]}
								className='swipe'
								key={character.name}
								onSwipe={(dir) => swiped(dir, character.name, index)}
								swipeRequirementType='position'
								swipeThreshold={10}
								onCardLeftScreen={() => outOfFrame(character.name, index)}
							>
								<div style={{ backgroundImage: `url(${process.env.PUBLIC_URL}${character.url})` }} className='card'>
									<h3>{character.name}</h3>
								</div>
							</TinderCard>
						))}
					</div>
					<h1 className='swipe-text'>Swipe to find your partner!</h1>
					<div className='buttons'>
						<button onClick={goBack}>
							Undo swipe!
						</button>
					</div>
				</>
			) : (
				<Chat partner={chatPartner} messages={chatMessages} setShowChat={setShowChat} setCurrentStep={setCurrentStep} onSendMessage={handleSendMessage} />
			)}


			{lastDirection && (
				<h2 key={lastDirection} className='infoText'>
					You swiped {lastDirection}
				</h2>
			)}
		</div>
	);
}

export default Swipper;
