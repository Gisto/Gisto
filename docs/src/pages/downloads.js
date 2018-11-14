import React from 'react';
import { Helmet } from 'react-helmet';
import Header from 'components/header';
import Footer from 'components/footer';
import Downloads from 'components/Downloads';

export default () => (
  <React.Fragment>
    <Helmet>
      <title>Downloads</title>
    </Helmet>
    <Header/>

    <h1>Downloads</h1>

    <Downloads/>

    <Footer/>
  </React.Fragment>
);
