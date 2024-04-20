import nodemailer from 'nodemailer';

require('dotenv').config();

const { GMAIL_USER } = process.env;
const { GMAIL_PASSWORD } = process.env;

const {GOOGLE_GMAIL_USER , GOOGLE_CLIENT_ID , GOOGLE_CLIENT_SECRET , GOOGLE_REFRESH_TOKEN} = process.env;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASSWORD
  }
});

// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     type: 'OAuth2',
//     user: GOOGLE_GMAIL_USER,
//     clientId: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     refreshToken: GOOGLE_REFRESH_TOKEN,
//   }
// });

// Check the connection
transporter.verify(function(error, success) {
    if (error) {
      console.error('Error verifying connection:', error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });
  
export default transporter;