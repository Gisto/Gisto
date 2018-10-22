import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import DashBoard from 'components/layout/content/DashBoard';
import Settings from 'components/layout/content/Settings';
import Snippet from 'components/layout/content/Snippet';
import About from 'components/layout/content/About';
import NewSnippet from 'components/layout/content/NewSnippet';

const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
  background: ${(props) => props.theme.bg};
  overflow: auto;
  position: relative;
`;

export const Content = () => (
  <ContentWrapper>
    <Router>
      <Switch>
        <Route exact path="/" component={ DashBoard }/>
        <Route path="/about" component={ About }/>
        <Route path="/settings" component={ Settings }/>
        <Route path="/snippet/:id" component={ Snippet }/>
        <Route path="/new" component={ NewSnippet }/>
      </Switch>
    </Router>
  </ContentWrapper>
);

Content.propTypes = {};

export default Content;
