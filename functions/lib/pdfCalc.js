const path = require('path');
const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');

// ミリメートルをポイントに変換（1インチ = 25.4ミリメートル, 1インチ = 72ポイント）
const mmToPt = (mm) => (mm * 72) / 25.4;


exports.pdfCalc = async (data) => {
  const {
    firstName,
    lastName,
    firstNameKana,
    lastNameKana,
    firstNameRoman,
    lastNameRoman,
    birthYear,
    birthMonth,
    birthDay,
    age,
    officeName,
    officeNameRoman,
    zipCode,
    address,
  } = data;

  const pdfPath = path.join(__dirname, '../assets/pdfs/05-sanjokaiin.pdf');
  const originalPdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  const pages = pdfDoc.getPages();

  pdfDoc.registerFontkit(fontkit)
  const fontPath = path.join(__dirname, '../assets/fonts/GenShinGothic-Normal-Sub.ttf');
  const fontBytes = fs.readFileSync(fontPath);
  const customFont = await pdfDoc.embedFont(fontBytes);

  let xPosition, yPosition;

  // firstName Position
  xPosition = mmToPt(75);
  yPosition = pages[0].getHeight() - mmToPt(163);
  pages[0].drawText(firstName, {
    x: xPosition,
    y: yPosition,
    size: 11,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // lastName Position
  xPosition = mmToPt(127);
  yPosition = pages[0].getHeight() - mmToPt(163);
  pages[0].drawText(lastName, {
    x: xPosition,
    y: yPosition,
    size: 11,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // firstNameKana Position
  xPosition = mmToPt(75);
  yPosition = pages[0].getHeight() - mmToPt(155);
  pages[0].drawText(firstNameKana, {
    x: xPosition,
    y: yPosition,
    size: 8,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // lastNameKana Position
  xPosition = mmToPt(127);
  yPosition = pages[0].getHeight() - mmToPt(155);
  pages[0].drawText(lastNameKana, {
    x: xPosition,
    y: yPosition,
    size: 8,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // firstNameRoman Position
  xPosition = mmToPt(75);
  yPosition = pages[0].getHeight() - mmToPt(171);
  pages[0].drawText(firstNameRoman, {
    x: xPosition,
    y: yPosition,
    size: 11,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // lastNameRoman Position
  xPosition = mmToPt(127);
  yPosition = pages[0].getHeight() - mmToPt(171);
  pages[0].drawText(lastNameRoman, {
    x: xPosition,
    y: yPosition,
    size: 11,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // birthYear Position
  xPosition = mmToPt(62);
  yPosition = pages[0].getHeight() - mmToPt(178);
  pages[0].drawText(birthYear.toString(), { // drawTextは文字列を期待するので数字から文字に変換
    x: xPosition,
    y: yPosition,
    size: 11,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // birthMonth Position
  xPosition = mmToPt(93);
  yPosition = pages[0].getHeight() - mmToPt(178);
  pages[0].drawText(birthMonth.toString(), {
    x: xPosition,
    y: yPosition,
    size: 11,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // birthDay Position
  xPosition = mmToPt(120);
  yPosition = pages[0].getHeight() - mmToPt(178);
  pages[0].drawText(birthDay.toString(), {
    x: xPosition,
    y: yPosition,
    size: 11,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // age Position
  xPosition = mmToPt(169);
  yPosition = pages[0].getHeight() - mmToPt(178);
  pages[0].drawText(age.toString(), {
    x: xPosition,
    y: yPosition,
    size: 11,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // officeName Position
  xPosition = mmToPt(58);
  yPosition = pages[0].getHeight() - mmToPt(186);
  pages[0].drawText(officeName, {
    x: xPosition,
    y: yPosition,
    size: 11,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // officeNameRoman Position
  xPosition = mmToPt(58);
  yPosition = pages[0].getHeight() - mmToPt(194);
  pages[0].drawText(officeNameRoman, {
    x: xPosition,
    y: yPosition,
    size: 11,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // zipCode Position
  xPosition = mmToPt(54);
  yPosition = pages[0].getHeight() - mmToPt(203);
  pages[0].drawText(zipCode, {
    x: xPosition,
    y: yPosition,
    size: 11,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // address Position
  xPosition = mmToPt(54);
  yPosition = pages[0].getHeight() - mmToPt(211);
  pages[0].drawText(address, {
    x: xPosition,
    y: yPosition,
    size: 11,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  return await pdfDoc.save();
}
