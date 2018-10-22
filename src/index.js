import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import store, { history } from 'store/store';

import { isElectron } from 'utils/electron';

import Layout from 'components/Layout';

import { version } from '../package';

if (isElectron) {
  const { init } = require('@sentry/electron');

  init({
    dsn: 'https://9b448264479b47418f9e248c208632ae@sentry.io/1245680',
    release: version,
    environment: process.env.NODE_ENV
  });
} else {
  const Raven = require('raven-js');

  Raven.config('https://9b448264479b47418f9e248c208632ae@sentry.io/1245680', {
    release: version,
    environment: process.env.NODE_ENV
  }).install();
}

const Gisto = () => (
  <Layout
    env={ process.env.NODE_ENV }
    electron={ process.version }
    chrome={ process.versions.chrome }/>
);

if (process.env.NODE_ENV === 'development') {
  const _ = require('lodash');
  const fp = require('lodash/fp');

  window.gistostore = store;
  window._ = _;
  window.fp = fp;
}

ReactDOM.render(
  <Provider store={ store }>
    <ConnectedRouter history={ history }>
      <Gisto/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('gisto')
);
