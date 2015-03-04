var config = {};

// Register for a Concur sandbox account at http://developer.concur.com/
config.concur = {};
config.concur.client_id = process.env.CLIENT_ID;
config.concur.client_secret = process.env.CLIENT_SECRET;

module.exports = config;