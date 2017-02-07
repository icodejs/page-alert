import cheerio from 'cheerio';

export const assertion = (html) => {
  const players = queryPage(html);
  const spaces = getOpenSpaces(players);
  return {
    send: spaces === 1,
    message: `${spaces} spaces left`
  };
};

export const getMailOptions = ({ url, email, recipient }) => {
  return {
    from: '"Page Alerts" <page-alerts@noreply.com>',
    to: recipient || email,
    subject: 'Footy Addicts - Last Space',
    html: `<p>
      There's 1 space available at: <a href="${url}">${url}</a>
    </p>`
  };
};

function queryPage(html) {
  const $ = cheerio.load(html);
  return $('.player').map((index, el) => {
    return $(el)
      .find('a')
      .text()
      .replace(/\n/gi, '');
  }).toArray();
}

function getOpenSpaces(players) {
  const duds = [
    'PlayFootball Staff',
    'Koulis Papadopoulos',
    'Kos Den',
    'Goran Dravic',
    'Open Spot',
    'Guest',
    'Mohamed Ibrahim',
    'Abdelhamid El Kaoutari',
    'Tumer Metin',
    'Miguel Rodriguez',
    'Javier Martínez',
  ];

  return players.filter(player => {
    return duds.some(dud => player.indexOf(dud) > -1);
  }).length;
}
