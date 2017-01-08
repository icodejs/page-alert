import nodemailer from 'nodemailer';
import optimist from 'optimist';
import { getMailOptions } from './sites/footy-addicts';
import queryPage from './query-page';

const [ url, email, password, recipient, duration = 5 ] = optimist.argv._;
const transport = `smtps://${email}:${password}@smtp.gmail.com`;
const transporter = nodemailer.createTransport(transport);

(async function() {
  const send = await queryPage({ url, duration });

  if (!send) {
    return;
  }

  const mailOptions = getMailOptions({
    url,
    email,
    recipient
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error(error);
    }
    console.log('Message sent: ' + info.response);
  });
}());
