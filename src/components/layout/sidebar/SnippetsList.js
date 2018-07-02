import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

const SnippetsListWrapper = styled.div`
  //display: flex;
  //flex-direction: column;
  overflow: auto;
  height: 100%;
`;

const SnippetsList = ({ children }) => (
  <SnippetsListWrapper>
    { children }
  </SnippetsListWrapper>
);

SnippetsList.defaultProps = {
  children: []
};

SnippetsList.propTypes = {
  children: PropTypes.node
};

export default SnippetsList;
