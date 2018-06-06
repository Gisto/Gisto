import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { size, isEmpty, trim } from 'lodash/fp';
import styled from 'styled-components';
import * as snippetActions from 'actions/snippets';
import { SIDEBAR_WIDTH, MINIMUM_CHARACTERS_TO_TRIGGER_SEARCH } from 'constants/config';
import { filterSnippetsList, isTag } from 'utils/snippets';
import Button from 'components/common/Button';
import Icon from 'components/common/Icon';
import {baseAppColor, borderColor, colorDanger} from 'constants/colors';
import Input from 'components/common/Input';

const SearchWrapper = styled.div`
  position: relative;
  padding: 0 10px;
  flex-direction: row;
  display: flex;
  width: ${SIDEBAR_WIDTH - 20}px;
  min-width: ${SIDEBAR_WIDTH - 20}px;
  color: #555;
  border-right: 1px solid ${borderColor};
  align-items: center;
  }
`;

const SearchTypeLabel = styled.span`
  position: absolute;
  font-size: 10px;
  top: 7px;
  left: 47px;
  height: auto;
  line-height: 1;
`;

const ClearAll = styled.a`
  cursor: pointer;
  color: ${colorDanger};
`;

const Search = ({
  snippets, filterSnippets, filterText, filterTags, filterLanguage, clearFilters
}) => {
  const countSnippets = size(filterSnippetsList(snippets, filterText, filterTags, filterLanguage));
  const searchType = () => {
    if (!isEmpty(trim(filterText))) {
      return isTag(filterText) ? 'free text tag' : 'free text';
    }

    if (!isEmpty(trim(filterTags))) {
      return `tags: ${filterTags}`;
    }

    if (!isEmpty(trim(filterLanguage))) {
      return `language: ${filterLanguage}`;
    }

    return '';
  };
  const shouldShowFilteredBy = !isEmpty(trim(filterText))
    || !isEmpty(trim(filterTags))
    || !isEmpty(trim(filterLanguage));
  const shouldFilter = (query) => {
    return size(query) > MINIMUM_CHARACTERS_TO_TRIGGER_SEARCH || isEmpty(query);
  };

  return (
    <SearchWrapper>
      <Icon type="search" size="46" color={ baseAppColor }/>

      { shouldShowFilteredBy && (
        <SearchTypeLabel>
          Search by <strong>{ searchType() }</strong> ({ countSnippets })
          &nbsp;
          <ClearAll onClick={ () => clearFilters() }>
            <Icon type="close-circle"
                  size={ 12 }
                  color={ colorDanger }/>
            &nbsp;
            <strong>clear all</strong>
          </ClearAll>
        </SearchTypeLabel>
      ) }

      <Input type="search"
             placeholder={ `Search ${countSnippets} snippets` }
             onChange={
               (event) => shouldFilter(event.target.value) && filterSnippets(event.target.value)
             }/>

      <Button icon="add">New snippet</Button>

    </SearchWrapper>
  );
};

Search.propTypes = {
  snippets: PropTypes.object,
  filterSnippets: PropTypes.func,
  clearFilters: PropTypes.func,
  filterText: PropTypes.string,
  filterTags: PropTypes.string,
  filterLanguage: PropTypes.string
};

const mapStateToProps = (state) => ({
  snippets: state.snippets.snippets,
  filterText: state.snippets.filter.text,
  filterTags: state.snippets.filter.tags,
  filterLanguage: state.snippets.filter.language
});

export default connect(mapStateToProps, {
  filterSnippets: snippetActions.filterSnippetsByText,
  clearFilters: snippetActions.clearAllFilters
})(Search);
