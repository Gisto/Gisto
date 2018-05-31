import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { size, isEmpty } from 'lodash/fp';
import styled from 'styled-components';
import * as snippetActions from 'actions/snippets';
import { SIDEBAR_WIDTH, MINIMUM_CHARACTERS_TO_TRIGGER_SEARCH } from 'constants/config';
import { filterSnippetsList, isTag } from 'utils/snippets';
import Button from 'components/common/Button';
import Icon from 'components/common/Icon';
import { baseAppColor, borderColor } from 'constants/colors';
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

const Search = ({ snippets, filterSnippets, filterText }) => {
  const countSnippets = size(filterSnippetsList(snippets, filterText));
  const searchType = isTag(filterText) ? 'tag' : 'free text';
  const shouldFilter = (query) => {
    return size(query) > MINIMUM_CHARACTERS_TO_TRIGGER_SEARCH || isEmpty(query);
  };

  return (
    <SearchWrapper>
      <Icon type="search" size="46" color={ baseAppColor }/>

      { filterText !== '' && (
        <SearchTypeLabel>
          Search by <strong>{ searchType }</strong> ({ countSnippets })
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
  filterText: PropTypes.string
};

const mapStateToProps = (state) => ({
  snippets: state.snippets.snippets,
  filterText: state.snippets.filter.text
});

export default connect(mapStateToProps, {
  filterSnippets: snippetActions.filterSnippets
})(Search);
