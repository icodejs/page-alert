import request from 'request-promise';
import sek from 'sek';
import { assertion } from './sites/footy-addicts';

export default ({ url, email, password, recipient, duration }) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      request({ url })
        .then(assertion({ url, email, password, recipient }))
        .then((result) => {
          if (result.alert) {
            clearInterval(interval);
            resolve(result.alert);
          }
          console.log(result.message);
        })
        .catch(reject);
    }, sek(duration));
  });
};
