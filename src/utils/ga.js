import { GAUA } from 'constants/config';
import { isElectron } from 'utils/electron';
import Analytics from 'electron-google-analytics';

let analytics = null;

if (isElectron) {
  analytics = new Analytics(GAUA);
}

export const gaPage = (page) => {
  if (isElectron) {
    return analytics.pageview('https://web.gistoapp.com', page, 'Gisto')
      .then((response) => {
        return response;
      })
      .catch((err) => {
        return err;
      });
  }

  gtag('config', GAUA, {
    page_title: page,
    page_path: page
  });

  return true;
};

export const gaEvent = ({
  category, action, label, value, cid
}) => {
  if (isElectron) {
    return analytics.event(category, action, { evLabel: label, evValue: value, clientID: cid })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        return err;
      });
  }
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value
  });

  return true;
};
