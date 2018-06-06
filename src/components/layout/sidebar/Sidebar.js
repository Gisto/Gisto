import React from 'react';
import { map } from 'lodash/fp';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SnippetsList from 'components/layout/sidebar/SnippetsList';
import Snippet from 'components/layout/sidebar/Snippet';
import { SIDEBAR_WIDTH } from 'constants/config';
import { baseAppColor } from 'constants/colors';
import { filterSnippetsList } from 'utils/snippets';

const SideBarWrapper = styled.div`
  width: ${SIDEBAR_WIDTH}px;
  background: ${baseAppColor};
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const Sidebar = ({ snippets, filterText, filterTags, filterLanguage }) => (
  <SideBarWrapper>
    <SnippetsList>
      { map((snippet) => (
        <Snippet key={ snippet.id } snippet={ snippet }/>
      ), filterSnippetsList(snippets, filterText, filterTags, filterLanguage)) }
    </SnippetsList>
  </SideBarWrapper>
);

const mapStateToProps = (state) => ({
  snippets: state.snippets.snippets,
  filterText: state.snippets.filter.text,
  filterTags: state.snippets.filter.tags,
  filterLanguage: state.snippets.filter.language
});

Sidebar.propTypes = {
  snippets: PropTypes.object,
  filterText: PropTypes.string,
  filterTags: PropTypes.string,
  filterLanguage: PropTypes.string
};

export default connect(mapStateToProps)(Sidebar);
