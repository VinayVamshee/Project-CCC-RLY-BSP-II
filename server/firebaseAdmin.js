require('dotenv').config();
const admin = require("firebase-admin");
const serviceAccount = process.env.SERVICE_ACCOUNT;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
