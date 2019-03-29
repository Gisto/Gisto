import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SnippetsListWrapper = styled.div`
  overflow: auto;
  height: 100%;
`;

export const SnippetsList = ({ children }) => <SnippetsListWrapper>{children}</SnippetsListWrapper>;

SnippetsList.defaultProps = {
  children: []
};

SnippetsList.propTypes = {
  children: PropTypes.node
};

export default SnippetsList;
