import request from 'request-promise';
import cheerio from 'cheerio';

const url = 'https://footyaddicts.com/football-games/19308-9-a-side-football-westway-sports-centre-london';

request({ url })
  .then(cheerio.load)
  .then($ => {
    const $players = $('.player');
    const count = $players.length;
    const players = $players.map((index, el) => {
      return $(el).find('a').attr('title');
    }).toArray();

    return { count, players }
  })
  .then(({ count, players }) => {
    const duds = [
      'PlayFootball Staff',
      'Koulis Papadopoulos',
      'Kos Den',
      'Kos Den\'s',
      'Goran Dravic',
      undefined
    ];

    const spaces = count - players.filter(p => duds.indexOf(p) > -1).length;
    return spaces;
  })
  .then(console.log)
  .catch(console.err);
