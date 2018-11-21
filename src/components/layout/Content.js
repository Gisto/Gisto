import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import Loadable from 'react-loadable';

import { getSetting } from 'utils/settings';

import Loading from 'components/common/Loading';

const DashBoard = Loadable({
  loader: () => import('components/layout/content/DashBoard'),
  loading: () => <Loading color={ getSetting('color') }/>
});

const Settings = Loadable({
  loader: () => import('components/layout/content/Settings'),
  loading: () => <Loading color={ getSetting('color') }/>
});

const Snippet = Loadable({
  loader: () => import('components/layout/content/Snippet'),
  loading: () => <Loading color={ getSetting('color') }/>
});

const About = Loadable({
  loader: () => import('components/layout/content/About'),
  loading: () => <Loading color={ getSetting('color') }/>
});

const NewSnippet = Loadable({
  loader: () => import('components/layout/content/NewSnippet'),
  loading: () => <Loading color={ getSetting('color') }/>
});

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
