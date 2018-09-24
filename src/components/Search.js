import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { size, isEmpty } from 'lodash/fp';
import styled from 'styled-components';
import ScrollPad from 'react-scrollpad';
import * as snippetActions from 'actions/snippets';
import { SIDEBAR_WIDTH, MINIMUM_CHARACTERS_TO_TRIGGER_SEARCH } from 'constants/config';
import { filterSnippetsList } from 'utils/snippets';

import Icon from 'components/common/Icon';
import { baseAppColor, borderColor } from 'constants/colors';
import Input from 'components/common/controls/Input';
import UtilityIcon from 'components/common/UtilityIcon';
import Taglist from 'components/common/Taglist';

const SearchWrapper = styled.div`
  position: relative;
  padding: 0 0 0 10px;
  flex-direction: row;
  display: flex;
  width: ${SIDEBAR_WIDTH - 10}px;
  min-width: ${SIDEBAR_WIDTH - 10}px;
  color: #555;
  border-right: 1px solid ${borderColor};
  align-items: center;
`;

const StyledInput = styled(Input)`
  margin: 0 10px 0 10px;
  flex: 1;
`;

const StyledTaglistWrapper = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr) ) ;
  color: ${baseAppColor};
  max-height: 50vh;
  overflow: auto;
  font-size: smaller;
  cursor: default;
  box-shadow: 0 1px 2px #555;
  width: 300px;
  background: #fff;
  
  > span {
    cursor: pointer;
  }
`;

export const Search = ({
  snippets, filterSnippets, filterText, filterTags, filterLanguage, filterStatus
}) => {
  const countSnippets = size(
    filterSnippetsList(snippets, filterText, filterTags, filterLanguage, filterStatus)
  );

  const shouldFilter = (query) => {
    return size(query) > MINIMUM_CHARACTERS_TO_TRIGGER_SEARCH || isEmpty(query);
  };

  return (
    <SearchWrapper>
      <Icon type="search" size="22" color={ baseAppColor }/>
      <StyledInput type="search"
                   placeholder={ `Search ${countSnippets} snippets` }
                   onChange={
                     (event) => shouldFilter(event.target.value)
                       && filterSnippets(event.target.value)
                   }/>

      <UtilityIcon dropdown type="tag" color={ baseAppColor }>
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
  filterSnippets: PropTypes.func,
  filterText: PropTypes.string,
  filterTags: PropTypes.array,
  filterLanguage: PropTypes.string,
  filterStatus: PropTypes.string
};

const mapStateToProps = (state) => ({
  snippets: state.snippets.snippets,
  filterText: state.snippets.filter.text,
  filterTags: state.snippets.filter.tags,
  filterLanguage: state.snippets.filter.language,
  filterStatus: state.snippets.filter.status
});

export default connect(mapStateToProps, {
  filterSnippets: snippetActions.filterSnippetsByText
})(Search);
