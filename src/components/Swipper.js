import React, { useState, useMemo, useRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import Chat from './Chat'; // Import the Chat component
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

const initialDb = [
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

function Swipper() {
    const [db, setDb] = useState(initialDb);
    const [currentIndex, setCurrentIndex] = useState(initialDb.length - 1);
    const [chatPartners, setChatPartners] = useState([]); // State to store matched chat partners
    const [showChatPanel, setShowChatPanel] = useState(false); // State to toggle chat panel visibility
    const [selectedChatPartner, setSelectedChatPartner] = useState(null); // State to store selected chat partner
    const [matchNotification, setMatchNotification] = useState(false); // State for match notification

    const currentIndexRef = useRef(currentIndex);
    const childRefs = useMemo(
        () =>
            Array(initialDb.length)
                .fill(0)
                .map((_, index) => React.createRef()),
        []
    );

    useEffect(() => {
        // Load chat partners from local storage on component mount
        const savedChatPartners = JSON.parse(localStorage.getItem('chatPartners')) || [];
        setChatPartners(savedChatPartners);

        // Filter out chat partners from db
        const remainingDb = initialDb.filter(
            (person) => !savedChatPartners.some((partner) => partner.name === person.name)
        );
        setDb(remainingDb);
        setCurrentIndex(remainingDb.length - 1); 
    }, []);

	useEffect(()=>{
		setCurrentIndex(db.length -1); 
	}, [showChatPanel])

    useEffect(() => {
        // Save chat partners to local storage whenever it changes
        localStorage.setItem('chatPartners', JSON.stringify(chatPartners));
    }, [chatPartners]);

    const updateCurrentIndex = (val) => {
        setCurrentIndex(val);
        currentIndexRef.current = val;
    };

    const swiped = (direction, nameToDelete, index) => {
        updateCurrentIndex(index - 1);

        // Simulate a match and show notification
        if (direction === 'right') {
            if (Math.random() < 0.3) {
                const matchedUser = db[index];
                // Check if the matched user is already in chatPartners
                if (!chatPartners.some(partner => partner.name === matchedUser.name)) {
                    // Add matched user to chat partners list
                    setChatPartners(prevPartners => [...prevPartners, matchedUser]);
                    setMatchNotification(true); 
                    setDb(db => db.filter((_, i) => i !== index)); 
                    updateCurrentIndex(db.length - 2); 
                }
            }
        }
    };

    const outOfFrame = (name, idx) => {
        console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
        // currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    };

    const openChat = (partner) => {
        setMatchNotification(false);
        setSelectedChatPartner(partner);
        setShowChatPanel(false); // Close the chat panel when opening a specific chat
    };

    const handleSwipe = async (direction) => {
        console.log(currentIndex);
        if (currentIndex >= 0 && childRefs[currentIndex].current) {
            await childRefs[currentIndex].current.swipe(direction); // Swipe the current card
        }
    };

    return (
        <div>
            <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
            <link href='https://fonts.googleapis.com/css?family=Alatsi&display=swap' rel='stylesheet' />

            {matchNotification && (
                <div className='notification'>
                    <div className='match-top'>
                        <p>You matched with {chatPartners[chatPartners.length - 1].name}!</p>
                        <button className="closeButton" onClick={() => setMatchNotification(false)}>X</button>
                    </div>
                    <button className='startChat' onClick={() => openChat(chatPartners[chatPartners.length - 1])}>Start Chat</button>
                </div>
            )}

            {(!showChatPanel && !selectedChatPartner) && (
                <>
                    <div className='cardContainer'>
                        <h4 style={{ margin: '0', position: 'relative', top: '25px', left: '90px', width: 'fit-content' }}>Tinder</h4>
                        <button className="slideButton" onClick={() => setShowChatPanel(true)}>
                            <i className="fas fa-comments"></i>
                        </button>
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
                    <div className='swipe-icons'>
                        <i className="fas fa-times fa-2x" style={{ color: 'red' }} onClick={() => handleSwipe('left')}></i>
                        <i className="fas fa-heart fa-2x" style={{ color: 'green' }} onClick={() => handleSwipe('right')}></i>
                    </div>
                    <h1 className='swipe-text'>Swipe to find your partner!</h1>
                </>
            )}
            <div className={`chatPanel ${showChatPanel ? 'open' : 'closed'}`}>
                <h2>Chats Available:</h2>
                <div className='chats'>
                    {chatPartners.map((partner, index) => (
                        <div key={index} className='chat-person'>
                            <img src={`${process.env.PUBLIC_URL}${partner.url}`} alt='user'></img>
                            <button onClick={() => openChat(partner)}>{partner.name}</button>
                        </div>
                    ))}
                </div>
                <button className="closeChat" onClick={() => setShowChatPanel(false)}>Close</button>
            </div>

            {selectedChatPartner && (
                <div className={`chat-container ${selectedChatPartner ? '' : 'hidden'}`}>
                    <Chat
                        setShowChatPanel={setShowChatPanel}
                        partner={selectedChatPartner}
                        setShowChat={setSelectedChatPartner}
                    />
                </div>
            )}
        </div>
    );
}

export default Swipper;
