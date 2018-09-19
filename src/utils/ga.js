import { GAUA } from 'constants/config';
import { isElectron } from 'utils/electron';

export const gaPage = (page) => {
  if (isElectron) {
    const Analytics  = require('electron-google-analytics').default;
    const analytics = new Analytics(GAUA);

    return analytics.pageview('https://web.gistoapp.com', page, 'Gisto');
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
    const Analytics  = require('electron-google-analytics').default;
    const analytics = new Analytics(GAUA);

    return analytics.event(category, action, { evLabel: label, evValue: value, clientID: cid });
  }
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value
  });

  return true;
};
