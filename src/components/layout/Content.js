import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { bg } from 'constants/colors';

import DashBorad from 'components/layout/content/DashBoard';
import Settings from 'components/layout/content/Settings';
import Snippet from 'components/layout/content/Snippet';
import About from 'components/layout/content/About';

const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
  background: ${bg};
`;

const Content = () => (
  <ContentWrapper>
    <Router>
      <Switch>
        <Route exact path="/" component={ DashBorad }/>
        <Route path="/about" component={ About }/>
        <Route path="/settings" component={ Settings }/>
        <Route path="/snippet/:id" component={ Snippet }/>
      </Switch>
    </Router>
  </ContentWrapper>
);

Content.propTypes = {};

export default Content;
