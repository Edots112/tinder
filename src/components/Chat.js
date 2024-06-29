import React, { useState, useRef, useEffect } from 'react';

const Chat = ({ partner, setShowChat, setShowChatPanel }) => {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');

	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		// Load messages from localStorage or initialize with a default message
		const storedMessages = localStorage.getItem(`${partner.name}-messages`);
		if (storedMessages) {
			setMessages(JSON.parse(storedMessages));
		} else {
			setMessages([{ id: 1, text: 'Hey there!', sender: 'partner' }]);
		}
	}, [partner]);

	useEffect(() => {
		// Scroll to bottom of messages when messages change
		scrollToBottom();
	}, [messages]);

	const handleSend = async () => {
		if (newMessage.trim() === '') return;

		const newMsgFromMe = {
			id: messages.length + 1,
			text: newMessage,
			sender: 'me',
		};

		setMessages(prevMessages => [...prevMessages, newMsgFromMe]);
		setNewMessage('');

		try {
			const newMsgFromPartner = await processMessageToGpt(newMsgFromMe);
			setMessages(prevMessages => [...prevMessages, newMsgFromPartner]);

			// Store updated messages in localStorage
			localStorage.setItem(`${partner.name}-messages`, JSON.stringify([...messages, newMsgFromMe, newMsgFromPartner]));
		} catch (error) {
			console.error('Error processing message:', error);
		}
	};

	async function processMessageToGpt(newMsgFromMe) {
		let apiMessage = messages.map((message) => {
			let role = message.sender === 'partner' ? 'assistant' : 'user';
			return { role: role, content: message.text };
		});

		const systemMessage = {
			role: "system",
			content: "act like its a tinder chat"
		};

		// Append the new message from the user to be sent to API
		apiMessage.push({ role: 'user', content: newMsgFromMe.text });

		let apiRequestBody = {
			model: 'gpt-3.5-turbo',
			messages: [
				systemMessage,
				...apiMessage
			]
		};

		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				"Authorization": "Bearer " + process.env.REACT_APP_OPENAI_KEY,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(apiRequestBody)
		});

		const data = await response.json();
		const text = data.choices[0].message.content;

		const newMsgFromPartner = {
			id: messages.length + 2,
			text: text,
			sender: 'partner',
		};

		return newMsgFromPartner;
	}

	return (
		<div className="chat-container">
			<div className="chat-header">
				<img src={`${process.env.PUBLIC_URL}/${partner.url}`} alt={partner.name} className="avatar" />
				<h2>{partner.name}</h2>
				<button onClick={() => { setShowChat(null); setShowChatPanel(true) }}>
					<svg width='15px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
						<path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z" />
					</svg>
				</button>
			</div>
			<div className="chat-messages">
				{messages.map((message, index) => (
					<div key={message.id} className={`message ${message.sender}`}>
						<p>{message.text}</p>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>
			<div className="chat-input">
				<input
					type="text"
					placeholder="Type a message..."
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
				/>
				<button onClick={handleSend}>
					<svg width='15px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
						<path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
					</svg>
				</button>
			</div>
		</div>
	);
};

export default Chat;
