import request from 'request-promise';
import cheerio from 'cheerio';

const url = 'https://footyaddicts.com/football-games/18741-5-a-side-football-playfootball-shepherds-bush-london';

request({ url })
  .then(cheerio.load)
  .then($ => {
    return $('.player').map((index, el) => {
      return {
        name: $(el).find('a').attr('title')
      }
    }).toArray();
  })
  .then(console.log)
  .catch(console.err);
