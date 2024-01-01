// regionの設定
const {setGlobalOptions} = require("firebase-functions/v2");
setGlobalOptions({ region: "asia-northeast2" });

const admin = require('firebase-admin');
admin.initializeApp();

// const { initializeApp } = require('firebase-admin/app');
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
// });

// ログ
const logger = require("firebase-functions/logger");

const { sendMail } = require('./v1/mail');
const { writePDF, editPDF, createPDF } = require('./v1/pdf');

module.exports = {
  sendMail,
  writePDF,
  editPDF,
  createPDF
};

