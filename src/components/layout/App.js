import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { baseAppColor } from 'constants/colors';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;
  color: ${baseAppColor};
`;

const App = (props) => (
  <AppWrapper>{ props.children }</AppWrapper>
);

App.propTypes = {
  children: PropTypes.node
};

export default App;
