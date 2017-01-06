import nodemailer from 'nodemailer';
import optimist from 'optimist';
import { getMailOptions } from './sites/footy-addicts';
import querySite from './query-site';

const [ url, email, password, recipient, duration = 5 ] = optimist.argv._;
const transport = `smtps://${email}:${password}@smtp.gmail.com`;
const transporter = nodemailer.createTransport(transport);
const options = { url, email, password, recipient, duration };

querySite(options)
  .then(getMailOptions(options))
  .then(mailOptions => {
    return new Promise((resolve, reject) => {
      if (!mailOptions) {
        return resolve('Do nothing');
      }

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
