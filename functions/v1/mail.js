const {onCall, HttpsError} = require("firebase-functions/v2/https");
const admin = require('firebase-admin');
const {adminMailBody, thanksMailBody} = require('../lib/mailBody');

const db = admin.firestore();

// メール作成
exports.sendMail = onCall(async (request) => {
  // メール送信の処理
  const data = request.data;
  const { name, email, content } = data;
  if (!email) {
    throw new HttpsError(
      "invalid-argument","email is required"
    );
  }

  const adminMailData = {
    // to: config().mail.admin_address,
    to: "dobo611@ichigo.me",
    message: {
      subject: "会員申込",
      text: adminMailBody({ name, email, content }),
    },
  };

  const thanksMailData = {
    to: email,
    message: {
      subject: "お申し込みありがとうございます",
      text: thanksMailBody({ name, email, content }),
    },
  };

  await db.collection("mail").add(adminMailData);
  await db.collection("mail").add(thanksMailData);

  // 関数の返り値（成功した場合は 'Success' など）
  return 'Success';
});
