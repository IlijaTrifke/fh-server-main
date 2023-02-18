const Prijave = require("../models/prijave");
const asyncWrapper = require("../errors/asyncWrapper.js");
const customError = require("../errors/customError");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const path = require("path");

let transporter = nodemailer.createTransport({
  service: "gmail",
  type: "SMTP",
  host: "smtp.gmail.com",
  // port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PWD,
  },
});

let potvrdaMail = {
  subject: "[FON HAKATON 2023][FONIS] - Uspešno evidentirana prijava",
  html: '<p>Po&scaron;tovani,</p> <p><br></p> <p>Va&scaron;a prijava za programersko takmičenje <strong>FON HAKATON 2023</strong> je <strong>uspe&scaron;no evidentirana</strong>.</p> <p><br></p> <p>Vi&scaron;e informacija možete očekivati nakon zatvaranja prijava.</p> <p><br></p> <p>Pozdrav,</p> <div> <div> <div align="left"> <table> <tbody> <tr> <td> <p><img src="https://lh5.googleusercontent.com/zzJV9API8HKKnyre6Q565fd22LqzDgFWUO67kAX6DR2AECHJkAkg8F3rXrFFlZOz6-u_Heag4YJNR_jR6bo2Py-JKh2R5uig1VnhLWYmnjhYNlN4mVQb52KFYX3uHvNHpwIQf8jRU_FrmoBxZzb3ICL7tKugfAyosFujsfEZI6WGrE6lPOTwrwJyfEeG95WO" width="151" height="151"></p> </td> </tr> </tbody> </table> </div>Ilija Trifunović<br>Koordinator tima za informacione tehnologije<br>na projektu FON Hakaton 2023.<br><br>Telefon:&nbsp;+ 381 65 4138 057<br>Mejl:&nbsp;<a href="mailto:ilija.trifunovic@fonis.rs" target="_blank">ilija.trifunovic@fonis.rs<br></a>Adresa: Jove Ilića 154, Beograd </div> </div>',
};

const sendEmail = (to, subject, html) => {
  let mailOptions = {
    from: process.env.EMAIL,
    to,
    cc: "tijana.lazic@fonis.rs",
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const napraviPrijavu = asyncWrapper(async (req, res, next) => {
  let prijava = req.body;
  console.log(prijava);

  // uslovi ukoliko bude trebalo

  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "../credentials.json"),
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  console.log(auth);
  const client = await auth.getClient();
  const spreadsheetId = "1M8VkcA6iv1mBVjo9VZNGYX212TSySPBJ23AmkwcP_E4";
  const googleSheets = google.sheets({ version: "v4", auth: client });

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:F",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [
        [
          prijava.pitanje1,
          prijava.pitanje2,
          prijava.pitanje3,
          prijava.pitanje4,
          prijava.clanovi[0].imePrezime +
            "\n" +
            prijava.clanovi[0].email +
            "\n" +
            prijava.clanovi[0].brojTelefona +
            "\n" +
            prijava.clanovi[0].status +
            "\n" +
            prijava.clanovi[0].imeSkole +
            "\n" +
            prijava.clanovi[0].linkCV,

          prijava.clanovi[1].imePrezime +
            "\n" +
            prijava.clanovi[1].email +
            "\n" +
            prijava.clanovi[1].brojTelefona +
            "\n" +
            prijava.clanovi[1].status +
            "\n" +
            prijava.clanovi[1].imeSkole +
            "\n" +
            prijava.clanovi[1].linkCV,

          prijava.clanovi[2].imePrezime +
            "\n" +
            prijava.clanovi[2].email +
            "\n" +
            prijava.clanovi[2].brojTelefona +
            "\n" +
            prijava.clanovi[2].status +
            "\n" +
            prijava.clanovi[2].imeSkole +
            "\n" +
            prijava.clanovi[2].linkCV,

          prijava.clanovi[3].imePrezime +
            "\n" +
            prijava.clanovi[3].email +
            "\n" +
            prijava.clanovi[3].brojTelefona +
            "\n" +
            prijava.clanovi[3].status +
            "\n" +
            prijava.clanovi[3].imeSkole +
            "\n" +
            prijava.clanovi[3].linkCV,
        ],
      ],
    },
  });

  let emails = "";
  for (let i = 0; i < prijava.clanovi.length; i++) {
    emails += prijava.clanovi[i].email + ", ";
  }
  sendEmail(emails, potvrdaMail.subject, potvrdaMail.html);
  await Prijave.create(prijava);
  res
    .status(201) //created
    .json({ success: true, msg: "Uspesno dodata prijava", data: null });
});

module.exports = {
  napraviPrijavu,
};
