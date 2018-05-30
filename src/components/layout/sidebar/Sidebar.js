import React from 'react';
import { map, filter } from 'lodash/fp';
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


const filterSnippets = (snippets, filterText) => {
  if (filterText !== '') {
    const regex = new RegExp(filterText, 'gi');

    return filter((snippet) => snippet.description.match(regex), snippets);
  }

  return snippets;
};

const Sidebar = ({ snippets, filterText }) => (
  <SideBarWrapper>
    <SnippetsList>
      { map((snippet) => (
        <Snippet key={ snippet.id } snippet={ snippet }/>
      ), filterSnippets(snippets, filterText)) }
    </SnippetsList>
  </SideBarWrapper>
);

const mapStateToProps = (state) => ({
  snippets: state.snippets.snippets,
  filterText: state.snippets.filter.text
});

Sidebar.propTypes = {
  snippets: PropTypes.object,
  filterText: PropTypes.string
};

export default connect(mapStateToProps)(Sidebar);
