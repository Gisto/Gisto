import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { size } from 'lodash/fp';
import styled from 'styled-components';
import * as snippetActions from 'actions/snippets';
import { SIDEBAR_WIDTH } from 'constants/config';
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

const Search = ({ countSnippets, filterSnippets }) => {
  const filterSnippetsByText = (value) => filterSnippets(value);

  return (
    <SearchWrapper>
      <Icon type="search" size="46" color={ baseAppColor }/>

      <SearchTypeLabel>
        Search by <b>type</b> ({countSnippets})
      </SearchTypeLabel>

      <Input type="search"
             onChange={ (event) => filterSnippetsByText(event.target.value) }
             placeholder={ `Search ${countSnippets} snippets` }/>

      <Button icon="add">New snippet</Button>

    </SearchWrapper>
  );
};

Search.propTypes = {
  countSnippets: PropTypes.number,
  filterSnippets: PropTypes.func
};

const mapStateToProps = (state) => ({
  countSnippets: size(state.snippets.snippets)
});

export default connect(mapStateToProps, {
  filterSnippets: snippetActions.filterSnippets
})(Search);
