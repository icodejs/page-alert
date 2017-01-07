import nodemailer from 'nodemailer';
import optimist from 'optimist';
import { getMailOptions } from './sites/footy-addicts';
import queryPage from './query-page';

const [ url, email, password, recipient, duration = 5 ] = optimist.argv._;
const transport = `smtps://${email}:${password}@smtp.gmail.com`;
const transporter = nodemailer.createTransport(transport);
const options = { url, email, password, recipient, duration };

queryPage(options)
  .then(getMailOptions(options))
  .then((mailOptions) => {
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return reject(error);
        }
        resolve('Message sent: ' + info.response);
      });
    });
  })
  .then(console.log)
  .catch(console.err);
