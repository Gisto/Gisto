import React from 'react';
import { isEmpty, map, trim, startCase } from 'lodash/fp';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

import { SIDEBAR_WIDTH } from 'constants/config';
import { filterSnippetsList, isTag } from 'utils/snippets';
import * as snippetActions from 'actions/snippets';

import SnippetsList from 'components/layout/sidebar/SnippetsList';
import Snippet from 'components/layout/sidebar/Snippet';
import Icon from 'components/common/Icon';

const SideBarWrapper = styled.div`
  width: ${SIDEBAR_WIDTH}px;
  background: ${(props) => props.theme.baseAppColor};
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const SearchFilters = styled.div`
  color: ${(props) => props.theme.baseAppColor};
  padding: 10px 20px;
  background: ${(props) => props.theme.lightText};
  z-index: 1;
  border-top: 1px solid ${(props) => props.theme.borderColor};
  box-shadow: 0 1px 2px ${(props) => props.theme.boxShadow};
  font-size: 12px;
`;

const ClearAll = styled.a`
  cursor: pointer;
  color: ${(props) => props.theme.colorDanger};
  white-space: nowrap;
`;

const Tag = styled.span`
  border: 1px solid ${(props) => props.theme.baseAppColor};
  color: ${(props) => props.theme.baseAppColor};
  padding: 1px 3px;
  border-radius: 3px;
  margin-right: 3px;
`;

export const Sidebar = ({
  snippets,
  filterText,
  filterTags,
  filterLanguage,
  clearFilters,
  removeTag,
  filterStatus,
  filterTruncated,
  filterUntagged,
  theme
}) => {
  const searchType = () => {
    if (!isEmpty(trim(filterText))) {
      return isTag(filterText) ? 'free text tag' : 'free text';
    }

    if (!isEmpty(filterTags)) {
      return (
        <span>
          {'tags '}{' '}
          {map(
            (tag) => (
              <Tag key={ tag }>
                {tag}
                &nbsp;
                <Icon
                  type="close"
                  clickable
                  size={ 12 }
                  onClick={ () => removeTag(tag) }
                  color={ theme.baseAppColor }/>
              </Tag>
            ),
            filterTags
          )}
        </span>
      );
    }

    if (!isEmpty(trim(filterLanguage))) {
      return `language: ${filterLanguage}`;
    }

    if (!isEmpty(filterStatus)) {
      return startCase(filterStatus);
    }

    if (filterTruncated === true) {
      return 'large files';
    }

    if (filterUntagged === true) {
      return 'untagged';
    }

    return '';
  };

  const shouldShowFilteredBy =
    !isEmpty(trim(filterText)) ||
    !isEmpty(trim(filterTags)) ||
    !isEmpty(trim(filterStatus)) ||
    !isEmpty(trim(filterLanguage)) ||
    filterTruncated ||
    filterUntagged;

  const snippetList = map(
    (snippet) => <Snippet key={ snippet.id } snippet={ snippet }/>,
    filterSnippetsList(
      snippets,
      filterText,
      filterTags,
      filterLanguage,
      filterStatus,
      filterTruncated,
      filterUntagged
    )
  );

  return (
    <SideBarWrapper>
      {shouldShowFilteredBy && (
        <SearchFilters>
          Filtered by <strong>{searchType()}</strong>
          &nbsp;
          <ClearAll onClick={ () => clearFilters() }>
            <Icon type="close-circle" size={ 12 } color={ theme.colorDanger }/>
            &nbsp;
            <strong>clear</strong>
          </ClearAll>
        </SearchFilters>
      )}
      <SnippetsList>{snippetList}</SnippetsList>
    </SideBarWrapper>
  );
};

const mapStateToProps = (state) => ({
  snippets: state.snippets.snippets,
  filterText: state.snippets.filter.text,
  filterTags: state.snippets.filter.tags,
  filterLanguage: state.snippets.filter.language,
  filterStatus: state.snippets.filter.status,
  filterTruncated: state.snippets.filter.truncated,
  filterUntagged: state.snippets.filter.untagged
});

Sidebar.propTypes = {
  snippets: PropTypes.object,
  theme: PropTypes.object,
  filterText: PropTypes.string,
  filterTags: PropTypes.array,
  filterLanguage: PropTypes.string,
  filterStatus: PropTypes.string,
  clearFilters: PropTypes.func,
  removeTag: PropTypes.func,
  filterTruncated: PropTypes.bool,
  filterUntagged: PropTypes.bool
};

export default withTheme(
  connect(
    mapStateToProps,
    {
      clearFilters: snippetActions.clearAllFilters,
      removeTag: snippetActions.removeTagFromFilter
    }
  )(Sidebar)
);
