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
    dsn: process.env.SENTRY_DSN,
    release: version,
    environment: process.env.NODE_ENV
  });
} else {
  const Raven = require('raven-js');

  Raven.config(process.env.SENTRY_DSN, {
    release: version,
    environment: process.env.NODE_ENV
  }).install();
}

const Gisto = () => (
  <Layout env={ process.env.NODE_ENV } electron={ process.version } chrome={ process.versions.chrome }/>
);

if (process.env.NODE_ENV === 'development') {
  const _ = require('lodash/fp');

  window.store = store;
  window._ = _;
}

ReactDOM.render(
  <Provider store={ store }>
    <ConnectedRouter history={ history }>
      <Gisto/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('gisto')
);
