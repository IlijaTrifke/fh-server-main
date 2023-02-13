const Prijave = require("../models/prijave");
const asyncWrapper = require("../errors/asyncWrapper.js");
const customError = require("../errors/customError");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PWD,
  },
});

let potvrdaMail = {
  subject: "[HZS 5-0][FONIS] - Uspešno evidentirana prijava",
  html: '<p>Poštovani,<br /><br /> Vaša prijava za programersko takmičenje Hakaton za srednjoškolce je uspešno evidentirana.<br /><br /> Rezultate prvog kruga selekcije možete očekivati nakon zatvaranja prijava.<br/><br/>Pozdrav,<br/> <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Roboto,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;white-space:pre-wrap;"><span style="border:none;display:inline-block;overflow:hidden;width:151px;height:151px;"><img src="https://lh4.googleusercontent.com/v2Lv4e6pORPorrT2_O7wOwnXopUwP7M_PtnvmonlMqA3-SLUyNq3PSaYkq3r0sjSltc9OPUTzNjjQGin8zTKaTwttUzd9uGDhzPCXXinniCuZ1WY_GtxKlBWizlstNCq0lXmXCg5cX6oik5qWZ4rIcXfcapGfFosSTB8NpTqGlMNhenys9ERJdrrGMPx_die" class="CToWUd a6T" data-bit="iit" tabindex="0" width="151" height="151"></span></span></p> <p dir="ltr" style="line-height:1.7999999999999998;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:16pt;font-family:Manrope,sans-serif;color:#000000;background-color:transparent;font-weight:200;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;white-space:pre-wrap;">NIKOLA RATKOVIĆ</span></p> <p dir="ltr" style="line-height:1.3800000000000001;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Manrope,sans-serif;color:#000000;background-color:transparent;font-weight:800;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;white-space:pre-wrap;">Koordinator IT tima na projektu</span></p> <p dir="ltr" style="line-height:1.3800000000000001;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Manrope,sans-serif;color:#000000;background-color:transparent;font-weight:800;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;white-space:pre-wrap;">Hakaton za srednjo&scaron;kolce 2022</span></p> <p dir="ltr" style="line-height:1.7999999999999998;background-color:#ffffff;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Manrope,sans-serif;color:#000000;background-color:transparent;font-weight:300;font-style:italic;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;white-space:pre-wrap;">Telefon:&nbsp;</span><span style="font-size:10pt;font-family:Manrope,sans-serif;color:#c3b0ff;background-color:transparent;font-weight:800;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;white-space:pre-wrap;">+381 607473724</span></p> <p dir="ltr" style="line-height:1.7999999999999998;background-color:#ffffff;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Manrope,sans-serif;color:#000000;background-color:transparent;font-weight:300;font-style:italic;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;white-space:pre-wrap;">Email:</span><span style="font-size:10pt;font-family:Manrope,sans-serif;color:#c3b0ff;background-color:transparent;font-weight:800;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;white-space:pre-wrap;">&nbsp;</span><a href="mailto:nikola.ratkovic@fonis.rs" style="text-decoration:none;" target="_blank"><span style="font-size:10pt;font-family:Manrope,sans-serif;color:#c3b0ff;background-color:transparent;font-weight:800;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;white-space:pre-wrap;">nikola.ratkovic@fonis.<wbr>rs</span></a></p> <p><span style="font-size:10pt;font-family:Manrope,sans-serif;color:#000000;background-color:transparent;font-weight:300;font-style:italic;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;white-space:pre-wrap;">Adresa:</span><a data-saferedirecturl="https://www.google.com/url?q=https://goo.gl/maps/tWGXWcyfqAopmfd97&source=gmail&ust=1667954382242000&usg=AOvVaw0O6VpvHJ4PqSJsNxoj7LG-" href="https://goo.gl/maps/tWGXWcyfqAopmfd97" style="text-decoration:none;" target="_blank"><span style="font-size:10pt;font-family:Manrope,sans-serif;color:#c3b0ff;background-color:transparent;font-weight:800;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;white-space:pre-wrap;">&nbsp;Jove Ilića 154, Beograd</span></a></p>',
};

const sendEmail = (to, subject, html) => {
  let mailOptions = {
    from: process.env.EMAIL,
    to,
    cc: "fh@fonis.rs",
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
  // console.log(prijava)

  // uslovi ukoliko bude trebalo

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
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
            prijava.clanovi[0].linkCV +
            "\n" +
            prijava.clanovi[0].linkGit,
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
            prijava.clanovi[1].linkCV +
            "\n" +
            prijava.clanovi[1].linkGit,
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
            prijava.clanovi[2].linkCV +
            "\n" +
            prijava.clanovi[2].linkGit,
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
            prijava.clanovi[3].linkCV +
            "\n" +
            prijava.clanovi[3].linkGit,
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
