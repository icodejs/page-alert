import request from 'request-promise';
import cheerio from 'cheerio';

const url = 'https://footyaddicts.com/football-games/18778-5-a-side-football-playfootball-shepherds-bush-london';

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

    const squad = players.filter(p => duds.indexOf(p) === -1).length;
    return numbersAside - squad;
  })
  .then(console.log) // if one space left, send an email
  .catch(console.err);
