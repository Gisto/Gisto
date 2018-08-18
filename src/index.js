import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import store from 'store/store';
import _ from 'lodash';
import * as fp from 'lodash/fp';

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

if (process.env.NODE_ENV === 'development') {
  window.store = store;
  window._ = _;
  window.fp = fp;
}

ReactDOM.render(
  <Provider store={ store }>
    <HashRouter>
      <Gisto/>
    </HashRouter>
  </Provider>,
  document.getElementById('gisto')
);
