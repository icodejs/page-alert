import request from 'request-promise';
import sek from 'sek';
import { assertion } from './sites/footy-addicts';

async function query(url) {
  const html = await request({ url });
  return assertion(html);
}

export default ({ url, duration }) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      query(url)
        .then((result) => {
          if (result.send) {
            clearInterval(interval);
            resolve(true);
          }
          console.log(result.message);
        })
        .catch(reject);

    }, sek(duration));
  });
};
