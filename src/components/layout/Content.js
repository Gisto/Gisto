import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { getSetting } from 'utils/settings';

import Loading from 'components/common/Loading';

const DashBoard = lazy(() => import('components/layout/content/DashBoard'));
const Settings = lazy(() => import('components/layout/content/Settings'));
const Snippet = lazy(() => import('components/layout/content/Snippet'));
const About = lazy(() => import('components/layout/content/About'));
const NewSnippet = lazy(() => import('components/layout/content/NewSnippet'));

const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
  background: ${(props) => props.theme.bg};
  overflow: auto;
  position: relative;
`;

export const Content = () => (
  <ContentWrapper>
    <Suspense fallback={ <Loading color={ getSetting('color') }/> }>
      <Router>
        <Switch>
          <Route exact path="/" component={ DashBoard }/>
          <Route path="/about" component={ About }/>
          <Route path="/settings" component={ Settings }/>
          <Route path="/snippet/:id" component={ Snippet }/>
          <Route path="/new" component={ NewSnippet }/>
        </Switch>
      </Router>
    </Suspense>
  </ContentWrapper>
);

Content.propTypes = {};

export default Content;
