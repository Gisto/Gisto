import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { size, isEmpty } from 'lodash/fp';
import styled, { withTheme } from 'styled-components';
import ScrollPad from 'react-scrollpad';

import { SIDEBAR_WIDTH, MINIMUM_CHARACTERS_TO_TRIGGER_SEARCH } from 'constants/config';

import * as snippetActions from 'actions/snippets';

import { filterSnippetsList } from 'utils/snippets';

import Icon from 'components/common/Icon';
import Input from 'components/common/controls/Input';
import UtilityIcon from 'components/common/UtilityIcon';
import Taglist from 'components/common/Taglist';
import Languagelist from 'components/common/Languagelist';

const SearchWrapper = styled.div`
  position: relative;
  padding: 0 0 0 10px;
  flex-direction: row;
  display: flex;
  width: ${SIDEBAR_WIDTH - 10}px;
  min-width: ${SIDEBAR_WIDTH - 10}px;
  color: #555;
  border-right: 1px solid ${(props) => props.theme.borderColor};
  align-items: center;
`;

const StyledInput = styled(Input)`
  margin: 0 10px 0 10px;
  flex: 1;
`;

const StyledTaglistWrapper = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  color: ${(props) => props.theme.baseAppColor};
  max-height: 50vh;
  overflow: auto;
  font-size: smaller;
  cursor: default;
  box-shadow: 0 1px 2px #555;
  width: 300px;
  background: #fff;
  z-index: 3;

  > span {
    cursor: pointer;
  }
`;

const StyledLanguagesWrapper = styled(StyledTaglistWrapper)`
  margin: 0 -50px 0 0 !important;

  > span {
    cursor: pointer;
    text-align: left;
  }
`;

export const Search = ({
  snippets,
  filterSnippets,
  filterText,
  filterTags,
  filterLanguage,
  filterStatus,
  filterTruncated,
  filterUntagged,
  theme
}) => {
  const countSnippets = size(
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

  const shouldFilter = (query) => {
    return size(query) > MINIMUM_CHARACTERS_TO_TRIGGER_SEARCH || isEmpty(query);
  };

  return (
    <SearchWrapper>
      <Icon type="search" size="22" color={ theme.baseAppColor }/>
      <StyledInput
        type="search"
        placeholder={ `Search ${countSnippets} snippets` }
        onChange={ (event) => shouldFilter(event.target.value) && filterSnippets(event.target.value) }/>

      <UtilityIcon dropdown type="code" color={ theme.baseAppColor }>
        <ScrollPad>
          <div>
            <StyledLanguagesWrapper className="list">
              <Languagelist/>
            </StyledLanguagesWrapper>
          </div>
        </ScrollPad>
      </UtilityIcon>
      <UtilityIcon dropdown type="tag" color={ theme.baseAppColor }>
        <ScrollPad>
          <div>
            <StyledTaglistWrapper className="list">
              <Taglist/>
            </StyledTaglistWrapper>
          </div>
        </ScrollPad>
      </UtilityIcon>
    </SearchWrapper>
  );
};

Search.propTypes = {
  snippets: PropTypes.object,
  theme: PropTypes.object,
  filterSnippets: PropTypes.func,
  filterText: PropTypes.string,
  filterTags: PropTypes.array,
  filterLanguage: PropTypes.string,
  filterStatus: PropTypes.string,
  filterTruncated: PropTypes.bool,
  filterUntagged: PropTypes.bool
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

export default withTheme(
  connect(
    mapStateToProps,
    {
      filterSnippets: snippetActions.filterSnippetsByText
    }
  )(Search)
);
