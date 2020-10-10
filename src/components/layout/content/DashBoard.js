import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { size, filter, map, flow, isEmpty, get } from 'lodash/fp';
import { HashRouter as Router, NavLink } from 'react-router-dom';

import {
  getSnippets,
  getStarredCount,
  getPrivate,
  getTruncated,
  getUntagged
} from 'selectors/snippets';

import { DEFAULT_SNIPPET_DESCRIPTION } from 'constants/config';

import * as snippetActions from 'actions/snippets';

import Icon from 'components/common/Icon';
import Input from 'components/common/controls/Input';
import ScrollPad from 'react-scrollpad';
import { gaPage } from 'utils/ga';
import Taglist from 'components/common/Taglist';
import Languagelist from 'components/common/Languagelist';

export class DashBoard extends React.Component {
  state = {
    searchTags: '',
    searchStarred: ''
  };

  componentDidMount() {
    this.props.getRateLimit();
    gaPage('Dashboard');
  }

  getStarred = () => {
    const starred = filter({ star: true }, this.props.snippets);

    if (!isEmpty(this.state.searchStarred)) {
      return filter((starredSnippet) => {
        const regex = new RegExp(this.state.searchStarred, 'gi');

        return starredSnippet.description.match(regex);
      }, starred);
    }

    return starred;
  };

  getUntitled = () =>
    flow([filter({ description: DEFAULT_SNIPPET_DESCRIPTION }), size])(this.props.snippets);

  linearGradient = (percentOf) => {
    const percents = (percentOf / size(this.props.snippets)) * 100;

    return {
      background: `linear-gradient(to right, ${this.props.theme.headerBgLightest} ${Math.floor(
        percents
      )}%, #fff ${Math.floor(percents)}%)`
    };
  };

  searchTags = (value) =>
    this.setState({
      searchTags: value
    });

  searchStarred = (value) =>
    this.setState({
      searchStarred: value
    });

  renderStarred = () =>
    map(
      (snippet) => (
        <li key={ snippet.id }>
          <Icon type={ snippet.public ? 'unlock' : 'lock' } color={ this.props.theme.baseAppColor }/>
          &nbsp;
          <Router>
            <StyledNavLink
              exact
              className="link"
              activeClassName="selected"
              title={ snippet.description }
              to={ `/snippet/${snippet.id}` }>
              {snippet.description}
            </StyledNavLink>
          </Router>
        </li>
      ),
      this.getStarred()
    );

  render() {
    const {
      snippets,
      privateSnippets,
      starred,
      searchByStatus,
      theme,
      truncatedSnippets,
      untaggedSnippets,
      searchByUntagged,
      searchByTruncated
    } = this.props;
    const publicSnippetsCount = size(snippets) - privateSnippets;

    return (
      <DashbordWrapper>
        {isEmpty(this.state.searchTags) && (
          <React.Fragment>
            <Private
              style={ this.linearGradient(privateSnippets) }
              onClick={ () => searchByStatus('private') }
              title="Click to filter private snippets">
              <h3>Private</h3>
              <span>{privateSnippets}</span>
            </Private>

            <Public
              style={ this.linearGradient(publicSnippetsCount) }
              onClick={ () => searchByStatus('public') }
              title="Click to filter public snippets">
              <h3>Public</h3>
              <span>{publicSnippetsCount}</span>
            </Public>

            <Starred
              style={ this.linearGradient(starred) }
              onClick={ () => searchByStatus('starred') }
              title="Click to filter starred snippets">
              <h3>Starred</h3>
              <span>{starred}</span>
            </Starred>

            <Truncated
              style={ this.linearGradient(truncatedSnippets) }
              onClick={ () => searchByTruncated() }
              title="Click to filter snippets with large files">
              <h3>Large</h3>
              <span>{truncatedSnippets}</span>
            </Truncated>

            <Untagged
              style={ this.linearGradient(untaggedSnippets) }
              onClick={ () => searchByUntagged() }
              title="Click to filter snippets with no tags">
              <h3>Untagged</h3>
              <span>{untaggedSnippets}</span>
            </Untagged>

            <Untitled
              style={ this.linearGradient(this.getUntitled()) }
              onClick={ () => searchByStatus('untitled') }
              title="Click to filter snippets with no description">
              <h3>Untitled</h3>
              <span>{this.getUntitled()}</span>
            </Untitled>
          </React.Fragment>
        )}

        {isEmpty(this.state.searchTags) && (
          <Language>
            <h3>Languages:</h3>
            <ScrollPad>
              <div>
                <Languagelist/>
              </div>
            </ScrollPad>
          </Language>
        )}

        {isEmpty(this.state.searchTags) && (
          <Stars>
            <HeadingWithSearch>
              <h3>Starred:</h3>
              <div>
                <Icon type="search" size="22" color={ theme.baseAppColor }/>
                <StyledInput
                  type="search"
                  placeholder="Search starred"
                  onChange={ (event) => this.searchStarred(event.target.value) }/>
              </div>
            </HeadingWithSearch>
            <ScrollPad>
              <ul>{this.renderStarred()}</ul>
            </ScrollPad>
          </Stars>
        )}

        <Tags>
          <HeadingWithSearch>
            <h3>Tags:</h3>
            <div>
              <Icon type="search" size="22" color={ theme.baseAppColor }/>
              <StyledInput
                type="search"
                placeholder="Search tags"
                onChange={ (event) => this.searchTags(event.target.value) }/>
            </div>
          </HeadingWithSearch>
          <ScrollPad>
            <div>
              <Taglist searchTags={ this.state.searchTags }/>
            </div>
          </ScrollPad>
        </Tags>
      </DashbordWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  snippets: getSnippets(state),
  starred: getStarredCount(state),
  privateSnippets: getPrivate(state),
  truncatedSnippets: getTruncated(state),
  untaggedSnippets: getUntagged(state),
  theme: get(['ui', 'settings', 'theme'], state)
});

const DashbordWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 2fr 2fr 2fr 2fr;
  grid-gap: 30px;
  color: #444;
  height: 100%;
  h3 {
    margin: 9px 0 20px;
    color: ${(props) => props.theme.baseAppColor};
    font-weight: 300;
    font-size: 16px;
  }
`;

const ContainerWithPills = `
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr) ) ;
  color: ${(props) => props.theme.baseAppColor};
  max-height: 50vh;
  overflow: auto;
  font-size: smaller;
  cursor: pointer;
`;

const Box = styled.div`
  background: ${(props) => props.theme.lightText};
  padding: 20px;
  border-radius: 3px;
  box-shadow: 0 0 10px ${(props) => props.theme.borderColor};
`;

const gridBoxInnerCss = css`
  h3 {
    font-size: 22px;
    margin: 0 0 10px 0;
  }

  span {
    font-size: 42px;
    float: right;
    color: ${(props) => props.theme.baseAppColor};

    small {
      font-size: 10px;
      float: right;
    }
  }

  :hover {
    box-shadow: 0 0 50px ${(props) => props.theme.borderColor};
    cursor: pointer;
  }
`;

const Public = styled(Box)`
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 1;

  ${gridBoxInnerCss};
`;

const Private = styled(Box)`
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 1;

  ${gridBoxInnerCss};
`;

const Starred = styled(Box)`
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 1;

  ${gridBoxInnerCss};
`;

const Truncated = styled(Box)`
  grid-column-start: 4;
  grid-column-end: 5;
  grid-row-start: 1;
  grid-row-end: 1;

  ${gridBoxInnerCss};
`;

const Untagged = styled(Box)`
  grid-column-start: 5;
  grid-column-end: 6;
  grid-row-start: 1;
  grid-row-end: 1;

  ${gridBoxInnerCss};
`;

const Untitled = styled(Box)`
  grid-column-start: 6;
  grid-column-end: 7;
  grid-row-start: 1;
  grid-row-end: 1;

  ${gridBoxInnerCss};
`;

const Language = styled(Box)`
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 2;
  grid-row-end: 2;
  max-height: 40vh;
  > div {
    ${ContainerWithPills};
    max-height: 35vh;
    overflow: auto;
  }
`;

const Stars = styled(Box)`
  grid-column-start: 4;
  grid-column-end: 7;
  grid-row-start: 2;
  grid-row-end: 2;
  max-height: 40vh;
  > ul {
    overflow: auto;
    max-height: 35vh;
    list-style-type: none;
    padding: 0;
    margin-top: 0;

    li {
      margin: 10px 0;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      &:after {
        content: '';
        width: 100px;
        height: 50px;
        position: absolute;
        top: 0;
        right: 0;
        background: -webkit-gradient(
          linear,
          left top,
          right top,
          color-stop(0%, rgba(255, 255, 255, 0)),
          color-stop(56%, rgba(255, 255, 255, 1)),
          color-stop(100%, rgba(255, 255, 255, 1))
        );
        background: -webkit-linear-gradient(
          left,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 1) 56%,
          rgba(255, 255, 255, 1) 100%
        );
      }
    }
  }
`;

const Tags = styled(Box)`
  grid-column-start: 1;
  grid-column-end: 7;
  grid-row-start: 3;
  grid-row-end: 3;
  > div {
    ${ContainerWithPills}
  }
`;

const HeadingWithSearch = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const StyledInput = styled(Input)`
  width: 15vw;
  margin: 0 10px;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: ${(props) => props.theme.baseAppColor};

  :hover {
    color: ${(props) => props.theme.headerBgLightest};
  }
`;

DashBoard.propTypes = {
  snippets: PropTypes.object,
  theme: PropTypes.object,
  starred: PropTypes.number,
  searchByStatus: PropTypes.func,
  getRateLimit: PropTypes.func,
  searchByTruncated: PropTypes.func,
  searchByUntagged: PropTypes.func,
  privateSnippets: PropTypes.number,
  untaggedSnippets: PropTypes.number,
  truncatedSnippets: PropTypes.number
};

export default connect(
  mapStateToProps,
  {
    searchByStatus: snippetActions.filterSnippetsByStatus,
    searchByTruncated: snippetActions.filterSnippetsByTruncated,
    searchByUntagged: snippetActions.filterSnippetsByUntagged,
    getRateLimit: snippetActions.getRateLimit
  }
)(DashBoard);
