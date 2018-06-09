import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, map } from 'lodash/fp';
import styled from 'styled-components';
import { baseAppColor, colorDanger, textColor } from 'constants/colors';
import * as snippetActions from 'actions/snippets';
import UtilityIcon from 'components/common/UtilityIcon';
import { copyToClipboard } from 'utils/snippets';

const SnippetHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Title = styled.div`
    flex: 1;
    text-align: left;
    padding: 1px 20px 1px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
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
`;

const Description = styled.span`
  color: ${textColor};
`;

const Languages = styled.span`
  color: ${baseAppColor};
  border: 1px solid ${baseAppColor}
  font-size: 11px;
  padding: 1px 3px;
  border-radius: 2px;
  margin: 0 5px 0 0;
  vertical-align: middle;
  cursor: pointer;
`;

const Link = styled.a`
  cursor: pointer;
  margin: 0 5px 0 0;
`;

export class SnippetHeader extends React.Component {
  toggleStar = (id, starred) =>
    starred ? this.props.unsetStar(id) : this.props.setStar(id);

  deleteSnippet = (id) => this.props.deleteSnippet(id);

  renderStarControl = () => {
    const snippet = get(this.props.match.params.id, this.props.snippets);
    const starred = get('star', snippet);
    const iconType = starred ? 'star-full' : 'star-empty';

    return (
      <UtilityIcon size={ 22 }
                   color={ baseAppColor }
                   onClick={ () => this.toggleStar(snippet.id, starred) }
                   type={ iconType }/>
    );
  };

  render() {
    const {
      snippets, match, searchByLanguages, searchByTags 
    } = this.props;
    const snippet = get(match.params.id, snippets);

    return (
      <SnippetHeaderWrapper>
        <Title>
          { map((language) => (
            <Languages key={ `${language}${snippet.id}` }
                       onClick={ () => searchByLanguages(language) }>
              { language }
            </Languages>
          ), get('languages', snippet)) }
          &nbsp;
          <Description title={ get('description', snippet) }>
            { get('description', snippet) }
          </Description>
          &nbsp;
          { map((tag) => (
            <Link key={ tag }
                  onClick={ () => searchByTags(tag) }>
              { tag }
            </Link>
          ), get('tags', snippet)) }
        </Title>
        <div>
          <UtilityIcon size={ 22 } color={ baseAppColor } type="edit"/>
          <UtilityIcon size={ 22 } color={ baseAppColor } type="file"/>
          <UtilityIcon size={ 22 } color={ baseAppColor } type={ get('public', snippet) ? 'unlock' : 'lock' }/>
          <UtilityIcon size={ 22 } color={ colorDanger } onClick={ () => this.deleteSnippet(snippet.id) } type="delete"/>
          <UtilityIcon size={ 22 } color={ baseAppColor } type="chat"/>
          { this.renderStarControl(snippet) }
          <UtilityIcon size={ 22 } color={ baseAppColor } type="ellipsis" dropdown>
            <ul>
              <li>Edit</li>
              <li>Open on web</li>
              <li>Download</li>
              <li>
                <Link onClick={ (event) => copyToClipboard(event, snippet.id) }>
                  Copy snippet ID to clipboard
                </Link>
              </li>
              <li>Copy Snippet URL to clipboard</li>
              <li>Copy HTTPS clone URL to clipboard</li>
              <li>Copy SSH clone URL to clipboard</li>
              <li>Open in GitHub desktop</li>
              <li className="color-danger"><a onClick={ () => this.deleteSnippet(snippet.id) }>Delete</a></li>
            </ul>
          </UtilityIcon>
        </div>
      </SnippetHeaderWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  snippets: state.snippets.snippets
});

SnippetHeader.propTypes = {
  snippets: PropTypes.object,
  match: PropTypes.object,
  searchByLanguages: PropTypes.func,
  searchByTags: PropTypes.func,
  setStar: PropTypes.func,
  unsetStar: PropTypes.func,
  deleteSnippet: PropTypes.func
};

export default connect(mapStateToProps, {
  searchByLanguages: snippetActions.filterSnippetsByLanguage,
  searchByTags: snippetActions.filterSnippetsByTags,
  setStar: snippetActions.starSnippet,
  unsetStar: snippetActions.unStarSnippet,
  deleteSnippet: snippetActions.deleteSnippet
})(SnippetHeader);
