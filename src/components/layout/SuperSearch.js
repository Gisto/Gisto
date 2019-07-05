import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, isEmpty, join, map, size } from 'lodash/fp';
import styled, { withTheme } from 'styled-components';
import { HashRouter as Router, NavLink } from 'react-router-dom';

import { MINIMUM_CHARACTERS_TO_TRIGGER_SEARCH } from 'constants/config';

import * as snippetActions from 'actions/snippets';

import { filterSnippetsList } from 'utils/snippets';
import { gaPage } from 'utils/ga';

import Input from 'components/common/controls/Input';
import Icon from 'components/common/Icon';

const SuperSearchWrapper = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  flex-direction: column;
  z-index: 99;
  background: rgba(0, 0, 0, 0.8);
  align-items: center;
  justify-content: center;
`;

const SearchWrapper = styled.div`
  width: 700px;
  position: absolute;
  top: 120px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  margin: 0 -18px 0 -30px;
`;

const StyledLookingGlass = styled(Icon)`
  left: 55px;
  position: relative;
`;

const SnippetResults = styled.div`
  background: transparent;
  align-items: center;
  flex-direction: column;
  width: 638px;
  padding: 0 30px;
  margin: 0 0 0 10px;
  height: 60vh;
  overflow: auto;
  display: block;
`;

const Result = styled.div`
  background: #fff;
  margin: 0 -30px 0 -30px;
  padding: 15px 20px;
  width: initial;
  border-bottom: 1px solid #ccc;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.bg};
  }
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  flex-direction: row;
  align-items: center;
  line-height: 21px;
  text-decoration: none;
  color: ${(props) => props.theme.baseAppColor};
  cursor: pointer;
`;

const Description = styled.span`
  width: 100%;
`;

const StyledInput = styled(Input)`
  padding: 30px 20px;
  box-shadow: 0 0 150px #fff;
  border-radius: 3px;
  text-indent: 50px;
  width: 100%;
`;

const StyledIcon = styled(Icon)`
  margin: 0 20px 0 0;
`;

export class SuperSearch extends Component {
  componentDidMount() {
    gaPage('supersearch');
  }

  shouldFilter = (query) => {
    return size(query) > MINIMUM_CHARACTERS_TO_TRIGGER_SEARCH || isEmpty(query);
  };

  handleSearchTerm = (event) => {
    return this.shouldFilter(event.target.value) && this.props.filterSnippets(event.target.value);
  };

  render() {
    const {
      snippets,
      filterText,
      filterTags,
      filterLanguage,
      toggleSuperSesrch,
      theme
    } = this.props;
    const filteredSnippets =
      size(filterText) <= MINIMUM_CHARACTERS_TO_TRIGGER_SEARCH
        ? []
        : filterSnippetsList(snippets, filterText, filterTags, filterLanguage);

    return (
      <SuperSearchWrapper>
        <SearchWrapper>
          <SearchBar>
            <StyledLookingGlass type="search" size={ 32 } color={ theme.baseAppColor }/>
            <StyledInput
              autoFocus
              type="search"
              className="mousetrap"
              onChange={ (event) => this.handleSearchTerm(event) }
              placeholder="Search"/>
          </SearchBar>
          <SnippetResults>
            {map(
              (snippet) => (
                <Result key={ snippet.id }>
                  <Router>
                    <StyledNavLink
                      exact
                      onClick={ () => toggleSuperSesrch() }
                      to={ `/snippet/${snippet.id}` }>
                      <StyledIcon type="book" size={ 32 } color={ theme.baseAppColor }/>
                      <Description>
                        {snippet.description} {join(', ', snippet.tags)}
                      </Description>
                    </StyledNavLink>
                  </Router>
                </Result>
              ),
              filteredSnippets
            )}
          </SnippetResults>
        </SearchWrapper>
      </SuperSearchWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  snippets: get(['snippets', 'snippets'], state),
  filterText: state.snippets.filter.text,
  filterTags: state.snippets.filter.tags,
  filterLanguage: state.snippets.filter.language
});

SuperSearch.propTypes = {
  snippets: PropTypes.object,
  theme: PropTypes.object,
  filterSnippets: PropTypes.func,
  filterText: PropTypes.string,
  filterTags: PropTypes.array,
  filterLanguage: PropTypes.string,
  toggleSuperSesrch: PropTypes.func
};

export default withTheme(
  connect(
    mapStateToProps,
    {
      filterSnippets: snippetActions.filterSnippetsByText
    }
  )(SuperSearch)
);
