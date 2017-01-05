import request from 'request-promise';
import nodemailer from 'nodemailer';
import cheerio from 'cheerio';
import optimist from 'optimist';

const { argv } = optimist;
const [ url, email, password, recipient ] = argv._;
const transporter = nodemailer.createTransport(`smtps://${email}:${password}@smtp.gmail.com`);

request({ url })
  .then(cheerio.load)
  .then($ => {
    const $players = $('.player');
    const numbersAside = $players.length;
    const players = $players.map((index, el) => {
      const name = $(el).find('a').attr('title');
      if (!name) {
        return 'open'
      }
      return name;
    }).toArray();

    return { numbersAside, players }
  })
  .then(({ numbersAside, players }) => {
    const duds = [
      'PlayFootball Staff',
      'Koulis Papadopoulos',
      'Kos Den',
      'Kos Den\'s',
      'Goran Dravic',
      'open',
      undefined
    ];
    return numbersAside - players.filter(p => duds.indexOf(p) === -1).length;
  })
  .then(space => {
    if (space !== 1) {
      return;
    }

    return {
      from: '"Page Alerts" <page-alerts@noreply.com>',
      to: recipient || email,
      subject: 'Footy Addicts - Last Space',
      html: `<p>There's ${space} space available at: <a href="${url}">${url}</a></p>`
    };
  })
  .then(options => {
    return new Promise((resolve, reject) => {
      if (!options) {
        return resolve('Do nothing');
      }

      transporter.sendMail(options, (error, info) => {
        if (error) {
          return reject(error);
        }
        resolve('Message sent: ' + info.response);
      });
    });
  })
  .then(console.log)
  .catch(console.err);

// e.g.
// npm start https://footyaddicts.com/football-games/18778-5-a-side-football-playfootball-shepherds-bush-london icodejs@gmail.com passw

// Notes
// Send via gmail: https://www.google.com/settings/security/lesssecureapps
