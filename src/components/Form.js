import React, { useState } from 'react'

const Form = (props) => {
	const [profilePic, setProfilePic] = useState(null);
	const [bio, setBio] = useState('');
	const [options, setOptions] = useState({
		marriage: false,
		friendships: false,
		networking: false,
	});
	const [name, setName] = useState('');

	const handleProfilePicChange = (e) => {
		setProfilePic(e.target.files[0]);
	};

	const handleBioChange = (e) => {
		setBio(e.target.value);
	};

	const handleNameChange = (e) => {
		setName(e.target.value);
	}

	const handleOptionChange = (e) => {
		const { name, checked } = e.target;
		setOptions(prevOptions => ({
			...prevOptions,
			[name]: checked
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Collect form data
		const formData = {
			profilePic,
			bio,
			options,
			name
		};
		localStorage.setItem('name', name);
		console.log(formData);
		alert('Account created successfully!');
		props.setCurrentStep('swipper');
	};

	return (
		<>
			<img src={`${process.env.PUBLIC_URL}/img/tinder.jpg`} alt='logo' width='35px' style={{
				position: 'relative',
				left: '0px',
				top: '20px',
				borderRadius: '20px'
			}} />
			<form className="account-form" onSubmit={handleSubmit}>
				<h2>Create Account</h2>
				<input type="file" name="profilePic" accept="image/*" onChange={handleProfilePicChange} />
				<input type="text" name="name" placeholder="Name" value={name} onChange={handleNameChange} required />
				<textarea name="bio" placeholder="Bio" rows="4" value={bio} onChange={handleBioChange} required></textarea>
				<div className='labels'>
					<div className='label'>
						<label>
							Looking for marriage
						</label>
						<input type="checkbox" name="marriage" checked={options.marriage} onChange={handleOptionChange} />
					</div>
					<div className='label'>
						<label>
							Seeking friendships
						</label>
						<input type="checkbox" name="friendships" checked={options.friendships} onChange={handleOptionChange} />
					</div>
					<div className='label'>
						<label>
							Open to networking
						</label>
						<input type="checkbox" name="networking" checked={options.networking} onChange={handleOptionChange} />
					</div>
				</div>
				<button style={{ cursor: 'pointer' }} type="submit">Create Account</button>
			</form>
		</>
	)
}

export default Form