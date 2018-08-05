import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  get, map, size, toString, isEmpty
} from 'lodash/fp';
import styled from 'styled-components';

import {
  baseAppColor, colorDanger, colorSuccess, textColor
} from 'constants/colors';
import * as snippetActions from 'actions/snippets';
import { copyToClipboard, prepareFilesForUpdate } from 'utils/snippets';

import UtilityIcon from 'components/common/UtilityIcon';
import Input from 'components/common/Input';
import Anchor from 'components/common/Anchor';
import { defaultGistURL } from 'constants/config';
import ExternalLink from 'components/common/ExternalLink';

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
      top: 3px;
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
  border: 1px solid ${baseAppColor};
  font-size: 11px;
  padding: 1px 3px;
  border-radius: 2px;
  margin: 0 5px 0 0;
  vertical-align: middle;
  cursor: pointer;
`;

export class SnippetHeader extends React.Component {
  state = {
    showToolbox: true
  };

  toggleToolbox = () => {
    this.setState((prevState) => ({
      showToolbox: !prevState.showToolbox
    }));
  };

  toggleStar = (id, starred) => starred ? this.props.unsetStar(id) : this.props.setStar(id);

  deleteSnippet = (id) => this.props.deleteSnippet(id);

  prepareAndUpdateSnippet = () => {
    const snippet = get(this.props.match.params.id, this.props.snippets);

    this.props.updateSnippet(prepareFilesForUpdate(this.props.tempSnippet), snippet.id);
  };

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

  renderEditControls = () => {
    const {
      editSnippet, cancelEditSnippet, edit, match, snippets, addTempFile
    } = this.props;
    const snippet = get(match.params.id, snippets);

    if (edit) {
      return (
        <React.Fragment>
          <UtilityIcon size={ 22 }
                       color={ colorSuccess }
                       onClick={ () => this.prepareAndUpdateSnippet() }
                       type="check"
                       text="Save"/>
          <UtilityIcon size={ 22 }
                       color={ colorDanger }
                       onClick={ () => cancelEditSnippet() }
                       type="close"
                       text="Cancel"/>
          <UtilityIcon size={ 22 }
                       color={ baseAppColor }
                       type="file"
                       dropdown
                       text={ `${size(get('files', snippet))} File(s)` }>
            <ul>
              <li>
                <Anchor onClick={ () => addTempFile() }>
                  Add new file
                </Anchor>
              </li>
            </ul>
          </UtilityIcon>
        </React.Fragment>
      );
    }

    return (
      <UtilityIcon size={ 22 } color={ baseAppColor } onClick={ () => editSnippet(snippet.id) } type="edit"/>
    );
  };

  renderSnippetDescription = () => {
    const {
      edit, tempSnippet, snippets, match, updateTempSnippet
    } = this.props;
    const snippet = get(match.params.id, snippets);

    if (!edit) {
      return (
        <Description onMouseOver={ () => this.toggleToolbox() }
                     onMouseOut={ () => this.toggleToolbox() }
                     onBlur={ () => this.toggleToolbox() }
                     onFocus={ () => this.toggleToolbox() }
                     title={ get('description', snippet) }>
          {get('description', snippet)}
        </Description>
      );
    }

    return (
      <Input value={ `${get('description', tempSnippet)} ${get('tags', snippet)}` }
             onChange={ (event) => updateTempSnippet('description', event.target.value) }/>
    );
  };

  renderTitle = () => {
    const {
      snippets, match, searchByLanguages, searchByTags, edit
    } = this.props;
    const snippet = get(match.params.id, snippets);

    return (
      <Title>
        { !edit && map((language) => (
          <Languages key={ `${language}${snippet.id}` }
                     onClick={ () => searchByLanguages(language) }>
            { language }
          </Languages>
        ), get('languages', snippet)) }
        &nbsp;
        { this.renderSnippetDescription() }
        &nbsp;
        { !edit && map((tag) => (
          <Anchor key={ tag }
                  onClick={ () => searchByTags(tag) }>
            { tag }&nbsp;
          </Anchor>
        ), get('tags', snippet)) }
      </Title>
    );
  };

  render() {
    const {
      snippets, match, editSnippet, comments
    } = this.props;
    const snippet = get(match.params.id, snippets);
    const snippetId = get('id', snippet);
    const openOnWebUrl = `${defaultGistURL}/${get('username', snippet)}/${snippetId}`;
    const httpCloneUrl = `git clone ${defaultGistURL}/${snippetId}.git`;
    const sshCloneUrl = `git clone git@gist.github.com:${snippetId}.git`;
    const openInGHDesktop = `x-github-client://openRepo/${defaultGistURL}/${snippetId}`;

    return (
      <SnippetHeaderWrapper>

        { this.renderTitle() }

        { this.state.showToolbox && (
          <div>
            { this.renderEditControls() }
            <UtilityIcon size={ 22 } color={ baseAppColor } type={ get('public', snippet) ? 'unlock' : 'lock' }/>
            <UtilityIcon size={ 22 } color={ colorDanger } onClick={ () => this.deleteSnippet(snippetId) } type="delete"/>
            <UtilityIcon size={ 22 }
                         color={ baseAppColor }
                         type="chat"
                         onClick={ () => this.props.toggleSnippetComments() }
                         text={ !isEmpty(comments) ? toString(size(comments)) : toString(get('comments', snippet)) }/>
            { this.renderStarControl(snippet) }
            <UtilityIcon size={ 22 } color={ baseAppColor } type="ellipsis" dropdown>
              <ul>
                <li><Anchor onClick={ () => editSnippet(snippetId) }>Edit</Anchor></li>
                <li><ExternalLink href={ openOnWebUrl }>Open on web</ExternalLink></li>
                <li><Anchor href={ `${openOnWebUrl}/download` }>Download</Anchor></li>
                <li className="color-danger">
                  <Anchor onClick={ () => this.deleteSnippet(snippetId) }>
                    Delete
                  </Anchor>
                </li>
                <li>
                  <Anchor onClick={ (event) => copyToClipboard(event, snippetId) }>
                  Copy snippet ID to clipboard
                  </Anchor>
                </li>
                <li>
                  <Anchor onClick={ (event) => copyToClipboard(event, openOnWebUrl) }>
                    Copy Snippet URL to clipboard
                  </Anchor>
                </li>
                <li>
                  <Anchor onClick={ (event) => copyToClipboard(event, httpCloneUrl) }>
                    Copy HTTPS clone command to clipboard
                  </Anchor>
                </li>
                <li>
                  <Anchor onClick={ (event) => copyToClipboard(event, sshCloneUrl) }>
                    Copy SSH clone command to clipboard
                  </Anchor>
                </li>
                <li>
                  <ExternalLink href={ openInGHDesktop }>
                    Open in GitHub desktop
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href={ `http://plnkr.co/edit/gist:${snippetId}?p=preview` }>
                    Open in Plnkr
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href={ `http://jsbin.com/gist/${snippetId}` }>
                    Open in JSBin
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href={ `http://jsfiddle.net/gh/gist/library/pure/${snippetId}/` }>
                    Open in jsfiddle
                  </ExternalLink>
                </li>
              </ul>
            </UtilityIcon>
          </div>
        ) }
      </SnippetHeaderWrapper>
    );
  }
}

const mapStateToProps = (state, { match }) => ({
  snippets: get(['snippets', 'snippets'], state),
  comments: get(['snippets', 'comments', match.params.id], state),
  edit: get(['ui', 'snippets', 'edit'], state),
  tempSnippet: get(['snippets', 'edit'], state)
});

SnippetHeader.propTypes = {
  snippets: PropTypes.object,
  match: PropTypes.object,
  searchByLanguages: PropTypes.func,
  searchByTags: PropTypes.func,
  setStar: PropTypes.func,
  unsetStar: PropTypes.func,
  deleteSnippet: PropTypes.func,
  editSnippet: PropTypes.func,
  cancelEditSnippet: PropTypes.func,
  updateTempSnippet: PropTypes.func,
  updateSnippet: PropTypes.func,
  addTempFile: PropTypes.func,
  toggleSnippetComments: PropTypes.func,
  edit: PropTypes.bool,
  tempSnippet: PropTypes.object,
  comments: PropTypes.object
};

export default connect(mapStateToProps, {
  searchByLanguages: snippetActions.filterSnippetsByLanguage,
  searchByTags: snippetActions.filterSnippetsByTags,
  setStar: snippetActions.starSnippet,
  unsetStar: snippetActions.unStarSnippet,
  deleteSnippet: snippetActions.deleteSnippet,
  editSnippet: snippetActions.editSnippet,
  cancelEditSnippet: snippetActions.cancelEditSnippet,
  updateTempSnippet: snippetActions.updateTempSnippet,
  addTempFile: snippetActions.addTempFile,
  updateSnippet: snippetActions.updateSnippet,
  toggleSnippetComments: snippetActions.toggleSnippetComments
})(SnippetHeader);
