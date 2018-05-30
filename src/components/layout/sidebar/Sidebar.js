import React from 'react';
import { map } from 'lodash/fp';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SnippetsList from 'components/layout/sidebar/SnippetsList';
import Snippet from 'components/layout/sidebar/Snippet';
import { SIDEBAR_WIDTH } from 'constants/config';
import { baseAppColor } from 'constants/colors';

const SideBarWrapper = styled.div`
  width: ${SIDEBAR_WIDTH}px;
  background: ${baseAppColor};
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const Sidebar = ({ snippets }) => (
  <SideBarWrapper>
    <SnippetsList>
      { map((snippet) => <Snippet key={ snippet.id } snippet={ snippet }/>, snippets) }
    </SnippetsList>
  </SideBarWrapper>
);

const mapStateToProps = (state) => ({
  snippets: state.snippets.snippets
});

Sidebar.propTypes = {
  snippets: PropTypes.object
};

export default connect(mapStateToProps)(Sidebar);
