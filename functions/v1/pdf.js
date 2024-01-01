// firebase
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const admin = require('firebase-admin');
const db = admin.firestore();
const storage = admin.storage();

// node.js
const path = require('path'); // node.jsのpathモジュール
const fs = require('fs'); // node.jsのfsモジュール

// pdf-lib
const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');

const {pdfCalc} = require('../lib/pdfCalc');

// ---------------
exports.writePDF = onCall(async (request) => {
  const data = request.data;
  const pdfBytes = await pdfCalc(data);

  // Save the PDF in Firebase Storage
  const file = admin.storage().bucket().file('writePdf.pdf');

  file.save(pdfBytes, { contentType: 'application/pdf' });
  const url = await file.getSignedUrl({ action: 'read', expires: '2030-01-01' });
  // // Save the download URL in Firestore
  const docRef = admin.firestore().collection('pdfs').doc('writePdf');
  await docRef.set({ url: url[0] });
});
// ---------------


// pdf作成
exports.editPDF = onCall(async (request) => {

  const data = request.data;
  const { firstName, lastName } = data;

  const pdfPath = path.join(__dirname, '../assets/pdfs/05-sanjokaiin.pdf');
  // __dirnameは現在のスクリプトが配置されているディレクトリを指す
  const originalPdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  const pages = pdfDoc.getPages();

  pdfDoc.registerFontkit(fontkit) // PDF-Libフォントキット初期設定
  const fontPath = path.join(__dirname, '../assets/fonts/GenShinGothic-Normal-Sub.ttf');
  const fontBytes = fs.readFileSync(fontPath);
  const customFont = await pdfDoc.embedFont(fontBytes);

  // ミリメートルをポイントに変換（1インチ = 25.4ミリメートル, 1インチ = 72ポイント）
  const mmToPt = (mm) => (mm * 72) / 25.4;
  let xPosition, yPosition;
  // 上から159mm、左端から75mmの位置に文字を追加

  xPosition = mmToPt(75);
  yPosition = pages[0].getHeight() - mmToPt(163);  // PDFの原点は左下なので、上からの位置を指定するには高さから減算する
  pages[0].drawText(firstName, {
    x: xPosition,
    y: yPosition,
    size: 11,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // 上から159mm、左端から127mmの位置に文字を追加
  xPosition = mmToPt(127);
  yPosition = pages[0].getHeight() - mmToPt(163);  // PDFの原点は左下なので、上からの位置を指定するには高さから減算する
  pages[0].drawText(lastName, {
    x: xPosition,
    y: yPosition,
    size: 11,
    font: customFont,
    color: rgb(0, 0, 0),
  });


  const pdfBytes = await pdfDoc.save();
  // Save the PDF in Firebase Storage
  const file = storage.bucket().file('editPdf.pdf');

  file.save(pdfBytes, { contentType: 'application/pdf' });
  const url = await file.getSignedUrl({ action: 'read', expires: '2030-01-01' });
  // // Save the download URL in Firestore
  const docRef = db.collection('pdfs').doc('editPdf');
  await docRef.set({ url: url[0] });
  // 処理内容
  });






// pdf作成
exports.createPDF = onCall(async (request) => {

  const data = request.data;
  const { comment } = data;

  const pdfDoc = await PDFDocument.create();

  pdfDoc.registerFontkit(fontkit)

  const fontPath = path.join(__dirname, '../assets/fonts/GenShinGothic-Normal-Sub.ttf');
  const fontBytes = fs.readFileSync(fontPath);
  const customFont = await pdfDoc.embedFont(fontBytes);

  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 30;
  page.drawText(comment, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: customFont,
      color: rgb(0, 0.53, 0.71),
  });


  const pdfBytes = await pdfDoc.save();
  // Save the PDF in Firebase Storage
  const file = storage.bucket().file('createPdf.pdf');

  file.save(pdfBytes, { contentType: 'application/pdf' });
  const url = await file.getSignedUrl({ action: 'read', expires: '2030-01-01' });
  // // Save the download URL in Firestore
  const docRef = db.collection('pdfs').doc('createPdf');
  await docRef.set({ url: url[0] });
  });
