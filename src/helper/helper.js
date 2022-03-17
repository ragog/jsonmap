const crypto = require('crypto')

const getHashFromRequest = (req) => {
	const apikeyFromRequest = req.headers.authorization.replace("Bearer ", "");

	let hash = crypto.createHash('sha512');
    hash.update(apikeyFromRequest);

	return hash.digest('hex')
}

module.exports = getHashFromRequest;