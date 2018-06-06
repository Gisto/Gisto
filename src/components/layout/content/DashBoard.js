import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  get, size, filter, map, flow, groupBy, flattenDeep,
  head, uniq, compact, sortBy, reverse, isEmpty
} from 'lodash/fp';
import { HashRouter as Router, NavLink } from 'react-router-dom';

import { baseAppColor, borderColor, headerBgLightest, lightText } from 'constants/colors';
import { DEFAULT_SNIPPET_DESCRIPTION } from 'constants/config';

import * as snippetActions from 'actions/snippets';

import Icon from 'components/common/Icon';
import Input from 'components/common/Input';

const DashbordWrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 3fr 3fr 3fr;
  grid-gap: 30px;
  color: #444;
  height: 100%;
  h3 {
    margin: 9px 0 20px;
    color: ${baseAppColor};
    font-weight: 300;
    font-size: 16px;
  }
`;

const ContainerWithPills = `
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr) ) ;
  color: ${baseAppColor};
  max-height: 50vh;
  overflow: auto;
  font-size: smaller;
  cursor: pointer;
`;

const Box = styled.div`
  background: ${lightText};
  padding: 20px;
  border-radius: 3px;
  box-shadow: 0 0 10px ${borderColor};
`;

const Private = Box.extend`
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 1;
  
  h3 {
    font-size: 22px;
    margin: 0 0 10px 0;
  }
  
  span {
    font-size: 42px;
    float: right;
    color: ${baseAppColor};
    
    small {
      font-size: 10px;
      float: right;
    }
  }
`;

const Public = Box.extend`
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 1;
  
  h3 {
    font-size: 22px;
    margin: 0 0 10px 0;
  }
  
  span {
    font-size: 42px;
    float: right;
    color: ${baseAppColor};
    
    small {
      font-size: 10px;
      float: right;
    }
  }
`;

const Starred = Box.extend`
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 1;
  
  h3 {
    font-size: 22px;
    margin: 0 0 10px 0;
  }
  
  span {
    font-size: 42px;
    float: right;
    color: ${baseAppColor};
    
    small {
      font-size: 10px;
      float: right;
    }
  }
`;

const Untitled = Box.extend`
  grid-column-start: 4;
  grid-column-end: 5;
  grid-row-start: 1;
  grid-row-end: 1;
  
  h3 {
    font-size: 22px;
    margin: 0 0 10px 0;
  }
  
  span {
    font-size: 42px;
    float: right;
    color: ${baseAppColor};
    
    small {
      font-size: 10px;
      float: right;
    }
  }
`;

const Language = Box.extend`
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 2;
  max-height: 40vh;
  > div {
    ${ContainerWithPills}
    max-height: 35vh;
    overflow: auto;
  }
  
  strong {
    //float: right;
  }
`;

const Stars = Box.extend`
  grid-column-start: 3;
  grid-column-end: 5;
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
      position:relative;
      overflow: hidden;
      white-space: nowrap;
      &:after {
      content: "";
      width: 100px;
      height: 50px;
      position: absolute;
      top: 0;
      right: 0;
      background: -webkit-gradient(linear, left top, right top, color-stop(0%, rgba(255, 255, 255, 0)), color-stop(56%, rgba(255, 255, 255, 1)), color-stop(100%, rgba(255, 255, 255, 1)));
      background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 56%, rgba(255, 255, 255, 1) 100%);
    }
    }
  }
`;

const Tags = Box.extend`
  grid-column-start: 1;
  grid-column-end: 5;
  grid-row-start: 3;
  grid-row-end: 3;
  > div {
    ${ContainerWithPills}
  }
`;

const Pill = styled.span`
  border: 1px solid ${headerBgLightest};
  color: ${baseAppColor};
  padding: 5px;
  border-radius: 3px;
  &:hover {
    border: 1px solid ${baseAppColor};
  }
`;

const HeadingWithSearch = styled.span`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
`;

const StyledInput = styled(Input)`
    width: 15vw;
    margin-top: 0;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: ${baseAppColor};
`;

export class DashBoard  extends React.Component {
  state = {
    searchTags: '',
    searchStarred: ''
  };

  getPrivate = () => flow([
    filter({ public: false }),
    size
  ])(this.props.snippets);

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

  getUntitled = () => flow([
    filter({ description: DEFAULT_SNIPPET_DESCRIPTION }),
    size
  ])(this.props.snippets);

  getLanguages = () => {
    const files = map('files', this.props.snippets);
    const grouped = groupBy('language', flattenDeep(files));

    const languages = map((language) => ({
      language: get('language', head(language)),
      size: size(language)
    }), grouped);

    return reverse(sortBy('size', languages));
  };

  getTags = () => {
    const tags = map('tags', this.props.snippets);

    const tagList = flow([
      flattenDeep,
      uniq,
      compact
    ])(tags);

    if (!isEmpty(this.state.searchTags)) {
      return filter((tag) => {
        const regex = new RegExp(this.state.searchTags, 'gi');

        return tag.match(regex);
      }, tagList.sort());
    }

    return tagList.sort();
  };

  linearGradient = (percentOf) => {
    const percents = (percentOf / size(this.props.snippets)) * 100;

    return {
      background: `linear-gradient(to right, #e5f6ff ${Math.floor(percents)}%, #fff ${Math.floor(percents)}%)`
    };
  };

  searchTags = (value) => this.setState({
    searchTags: value
  });

  searchStarred = (value) => this.setState({
    searchStarred: value
  });

  render() {
    return (
      <DashbordWrapper>
        { isEmpty(this.state.searchTags) && (
          <React.Fragment>
            <Private style={ this.linearGradient(size(this.props.snippets) - this.getPrivate()) }>
              <h3>Public</h3>
              <span>
                { size(this.props.snippets) - this.getPrivate() }
              </span>
            </Private>

            <Public style={ this.linearGradient(this.getPrivate()) }>
              <h3>Private</h3>
              <span>
                { this.getPrivate() }
              </span>
            </Public>

            <Starred style={ this.linearGradient(size(this.props.starred)) }>
              <h3>Starred</h3>
              <span>
                { size(this.props.starred) }
              </span>
            </Starred>

            <Untitled style={ this.linearGradient(this.getUntitled()) }>
              <h3>Untitled:</h3>
              <span>
                { this.getUntitled() }
              </span>
            </Untitled>
          </React.Fragment>
        ) }

        { isEmpty(this.state.searchTags) && (
          <Language>
            <h3>Languages:</h3>
            <div>
              { map((language) => (
                <Pill style={ this.linearGradient(language.size) }
                      key={ language.language }
                      onClick={ () => this.props.searchByLanguages(language.language) }>
                  { language.language || 'Other' }
                  <br/>
                  <strong>{ language.size }</strong>
                </Pill>
              ), this.getLanguages()) }
            </div>
          </Language>
        ) }

        { isEmpty(this.state.searchTags) && (
          <Stars>
            <HeadingWithSearch>
              <h3>Starred:</h3>
              <div>
                <Icon type="search" size="22" color={ baseAppColor }/>
                <StyledInput type="search"
                             placeholder="Search starred"
                             onChange={ (event) => this.searchStarred(event.target.value) }/>
              </div>
            </HeadingWithSearch>
            <ul>
              { map((snippet) => (
                <li key={ snippet.id }>
                  <Icon type={ snippet.public ? 'unlock' : 'lock' } color={ baseAppColor }/>
                  &nbsp;
                  <Router>
                    <StyledNavLink exact
                                   className="link"
                                   activeClassName="selected"
                                   title={ snippet.description }
                                   to={ `/snippet/${snippet.id}` }>
                      { snippet.description }
                    </StyledNavLink>
                  </Router>
                </li>
              ), this.getStarred()) }
            </ul>
          </Stars>
        ) }

        <Tags>
          <HeadingWithSearch>
            <h3>Tags:</h3>
            <div>
              <Icon type="search" size="22" color={ baseAppColor }/>
              <StyledInput type="search"
                           placeholder="Search tags"
                           onChange={ (event) => this.searchTags(event.target.value) }/>
            </div>
          </HeadingWithSearch>
          <div>
            { map((tag) => (
              <Pill key={ tag }
                    onClick={ () => this.props.searchByTags(tag) }>
                { tag }
              </Pill>
            ), this.getTags()) }
          </div>
        </Tags>
      </DashbordWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  snippets: get('snippets', state.snippets),
  starred: get('starred', state.snippets)
});

DashBoard.propTypes = {
  snippets: PropTypes.object,
  starred: PropTypes.array,
  searchByTags: PropTypes.func,
  searchByLanguages: PropTypes.func
};

export default connect(mapStateToProps, {
  searchByTags: snippetActions.filterSnippetsByTags,
  searchByLanguages: snippetActions.filterSnippetsByLanguage
})(DashBoard);
