import cheerio from 'cheerio';

export const assertion = () => (html) => {
  const gameInformation = getGameInformations(html);
  const spaces = getAvailablity(gameInformation);
  return spaces !== 1;
};

export const getMailOptions = ({ url, email, recipient }) => (assertTrue) => {
  if (!assertTrue) {
    return;
  }

  return {
    from: '"Page Alerts" <page-alerts@noreply.com>',
    to: recipient || email,
    subject: 'Footy Addicts - Last Space',
    html: `<p>There's 1 space available at: <a href="${url}">${url}</a></p>`
  };
};

function getGameInformations(html) {
  const $ = cheerio.load(html);
  const $players = $('.player');
  const playerCount = $players.length;
  const players = $players.map((index, el) => {
    const name = $(el).find('a').attr('title');
    if (!name) {
      return 'open';
    }
    return name;
  }).toArray();

  return { playerCount, players };
}

function getAvailablity({ playerCount, players }) {
  /* eslint-disable no-undefined */
  const duds = [
    'PlayFootball Staff',
    'Koulis Papadopoulos',
    'Kos Den',
    'Kos Den\'s',
    'Goran Dravic',
    'open',
    undefined
  ];
  return playerCount - players.filter(p => duds.indexOf(p) === -1).length;
}
