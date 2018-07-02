import React from 'react';
import { isEmpty, map, trim } from 'lodash/fp';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SnippetsList from 'components/layout/sidebar/SnippetsList';
import Snippet from 'components/layout/sidebar/Snippet';
import Icon from 'components/common/Icon';
import { SIDEBAR_WIDTH } from 'constants/config';
import { baseAppColor, borderColor, colorDanger, lightText, boxShadow } from 'constants/colors';
import { filterSnippetsList, isTag } from 'utils/snippets';
import * as snippetActions from 'actions/snippets';

const SideBarWrapper = styled.div`
  width: ${SIDEBAR_WIDTH}px;
  background: ${baseAppColor};
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const SearchFilters = styled.div`
  color: #3f84a8;
    padding: 10px 20px;
    background: ${lightText};
    z-index: 2;
    border-top: 1px solid ${borderColor};
    box-shadow: 0 1px 2px ${boxShadow};
    font-size: 12px;
`;

const ClearAll = styled.a`
  cursor: pointer;
  color: ${colorDanger};
  white-space: nowrap;
`;

const Tag = styled.span`
  border: 1px solid ${baseAppColor};
  color: ${baseAppColor};
  padding: 1px 3px;
  border-radius: 3px;
  margin-right: 3px;
`;

const Sidebar = ({
  snippets, filterText, filterTags, filterLanguage, clearFilters, removeTag
}) => {
  const searchType = () => {
    if (!isEmpty(trim(filterText))) {
      return isTag(filterText) ? 'free text tag' : 'free text';
    }

    if (!isEmpty(filterTags)) {
      return (
        <span>
          { 'tags ' } { map((tag) => (
            <Tag>
              { tag }
              &nbsp;
              <Icon type="close"
                    clickable
                    size={ 12 }
                    onClick={ () => removeTag(tag) }
                    color={ baseAppColor }/>
            </Tag>
          ), filterTags) }
        </span>
      );
    }

    if (!isEmpty(trim(filterLanguage))) {
      return `language: ${filterLanguage}`;
    }

    return '';
  };

  const shouldShowFilteredBy = !isEmpty(trim(filterText))
    || !isEmpty(trim(filterTags))
    || !isEmpty(trim(filterLanguage));

  return (
    <SideBarWrapper>
      { shouldShowFilteredBy && (
      <SearchFilters>
        Filtered by <strong>{ searchType() }</strong>
            &nbsp;
        <ClearAll onClick={ () => clearFilters() }>
          <Icon type="close-circle"
                    size={ 12 }
                    color={ colorDanger }/>
              &nbsp;
          <strong>clear all</strong>
        </ClearAll>
      </SearchFilters>
        ) }
      <SnippetsList>
        {map((snippet) => (
          <Snippet key={ snippet.id } snippet={ snippet }/>
        ), filterSnippetsList(snippets, filterText, filterTags, filterLanguage))}
      </SnippetsList>
    </SideBarWrapper>
  );
};

const mapStateToProps = (state) => ({
  snippets: state.snippets.snippets,
  filterText: state.snippets.filter.text,
  filterTags: state.snippets.filter.tags,
  filterLanguage: state.snippets.filter.language
});

Sidebar.propTypes = {
  snippets: PropTypes.object,
  filterText: PropTypes.string,
  filterTags: PropTypes.array,
  filterLanguage: PropTypes.string,
  clearFilters: PropTypes.func,
  removeTag: PropTypes.func
};

export default connect(mapStateToProps, {
  clearFilters: snippetActions.clearAllFilters,
  removeTag: snippetActions.removeTagFromFilter
})(Sidebar);
