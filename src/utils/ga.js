import { GAUA } from 'constants/config';
import { isElectron } from 'utils/electron';

export const gaPage = (page) => {
  if (isElectron) {
    const cid = localStorage.getItem('unique-app-id');

    const Analytics  = require('electron-google-analytics').default;
    const analytics = new Analytics(GAUA);
    const cookieDomain = 'https://web.gistoapp.com';

    return analytics.pageview(cookieDomain, page, 'Gisto', cid);
  }

  gtag('config', GAUA, {
    page_title: page,
    page_path: page
  });

  return true;
};

export const gaEvent = ({
  category, action, label, value
}) => {
  if (isElectron) {
    const cid = localStorage.getItem('unique-app-id');
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
