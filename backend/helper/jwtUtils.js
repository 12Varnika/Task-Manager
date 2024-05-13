const jwt = require('jsonwebtoken');

const generateToken = (user) => {
	const payload = {
		id: user._id,
		email: user.email,
		name: user.names
	};
	return jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' });
};

const verifyToken = (token) => {
	try {
		return jwt.verify(token, 'your_secret_key');
	} catch (error) {
		return null;
	}
};

module.exports = { generateToken, verifyToken };
