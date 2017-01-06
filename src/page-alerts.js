import request from 'request-promise';
import nodemailer from 'nodemailer';
import optimist from 'optimist';
import { assertion, getMailOptions } from './sites/footy-addicts';

const [ url, email, password, recipient ] = optimist.argv._;
const transport = `smtps://${email}:${password}@smtp.gmail.com`;
const transporter = nodemailer.createTransport(transport);

request({ url })
  .then(assertion({ url, email, password, recipient }))
  .then(getMailOptions({ url, email, password, recipient }))
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
