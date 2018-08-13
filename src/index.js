import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import store from 'store/store';

import Layout from 'components/Layout';

import { version } from '../package';

const { init } = require('@sentry/electron');

init({
  dsn: 'https://9b448264479b47418f9e248c208632ae@sentry.io/1245680',
  release: version,
  environment: process.env.NODE_ENV
});

const Gisto = () => (
  <Layout
    env={ process.env.NODE_ENV }
    electron={ process.version }
    chrome={ process.versions.chrome }/>
);

ReactDOM.render(
  <Provider store={ store }>
    <HashRouter>
      <Gisto/>
    </HashRouter>
  </Provider>,
  document.getElementById('gisto')
);
