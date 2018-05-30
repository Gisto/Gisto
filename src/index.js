import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import store from 'store/store';

import Layout from 'components/Layout';

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
