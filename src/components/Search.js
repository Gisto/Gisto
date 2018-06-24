import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { size, isEmpty } from 'lodash/fp';
import styled from 'styled-components';
import { HashRouter as Router, Link } from 'react-router-dom';

import * as snippetActions from 'actions/snippets';
import { SIDEBAR_WIDTH, MINIMUM_CHARACTERS_TO_TRIGGER_SEARCH } from 'constants/config';
import { filterSnippetsList } from 'utils/snippets';

import Button from 'components/common/Button';
import Icon from 'components/common/Icon';
import { baseAppColor, borderColor, lightText } from 'constants/colors';
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
`;

const StyledLink = styled(Link)`
  color: ${lightText};
  text-decoration: none;
`;

const Search = ({
  snippets, filterSnippets, filterText, filterTags, filterLanguage
}) => {
  const countSnippets = size(filterSnippetsList(snippets, filterText, filterTags, filterLanguage));

  const shouldFilter = (query) => {
    return size(query) > MINIMUM_CHARACTERS_TO_TRIGGER_SEARCH || isEmpty(query);
  };

  return (
    <SearchWrapper>
      <Icon type="search" size="46" color={ baseAppColor }/>
      <Input type="search"
             placeholder={ `Search ${countSnippets} snippets` }
             onChange={
               (event) => shouldFilter(event.target.value) && filterSnippets(event.target.value)
             }/>

      <Router>
        <Button icon="add" width="200px" height="30px">
          <StyledLink to="/new">New snippet</StyledLink>
        </Button>
      </Router>

    </SearchWrapper>
  );
};

Search.propTypes = {
  snippets: PropTypes.object,
  filterSnippets: PropTypes.func,
  filterText: PropTypes.string,
  filterTags: PropTypes.array,
  filterLanguage: PropTypes.string
};

const mapStateToProps = (state) => ({
  snippets: state.snippets.snippets,
  filterText: state.snippets.filter.text,
  filterTags: state.snippets.filter.tags,
  filterLanguage: state.snippets.filter.language
});

export default connect(mapStateToProps, {
  filterSnippets: snippetActions.filterSnippetsByText
})(Search);
