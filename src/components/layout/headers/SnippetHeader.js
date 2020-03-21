import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { drop, get, isEmpty, map, size, toString, isArray } from 'lodash/fp';
import styled from 'styled-components';

import { DEFAULT_SNIPPET_DUPLICATE_SUFFIX } from 'constants/config';
import * as snippetActions from 'actions/snippets';
import { copyToClipboard, prepareFilesForUpdate, prepareFilesForDuplication } from 'utils/snippets';
import { dateFormatToString } from 'utils/date';

import UtilityIcon from 'components/common/UtilityIcon';
import Input from 'components/common/controls/Input';
import Anchor from 'components/common/Anchor';
import ExternalLink from 'components/common/ExternalLink';
import { getSnippetUrl } from 'utils/url';
import { isEnterpriseLogin } from 'utils/login';
import Icon from 'components/common/Icon';

const SnippetHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const History = styled.span`
  div {
    color: ${(props) => props.theme.baseAppColor};
    display: flex;
    margin: 10px 0;
    justify-content: space-between;

    &.changed {
      width: 230px;
    }
  }
`;

const Additions = styled.span`
  background: ${(props) => props.theme.colorSuccess};
  color: #fff;
  padding: 0 5px;

  + span {
    margin: 0 0 0 10px;
  }
`;

const Deletions = styled.span`
  background: ${(props) => props.theme.colorDanger};
  color: #fff;
  padding: 0 7px;

  + span {
    margin: 0 0 0 10px;
  }
`;

const Title = styled.div`
  flex: 1;
  text-align: left;
  padding: 1px 20px 1px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  width: 50vw;
`;

const Description = styled.span`
  color: ${(props) => props.theme.textColor};
`;

const Languages = styled.span`
  color: ${(props) => props.theme.baseAppColor};
  border: 1px solid ${(props) => props.theme.baseAppColor};
  font-size: 11px;
  padding: 1px 3px;
  border-radius: 2px;
  margin: 0 5px 0 0;
  vertical-align: middle;
  cursor: pointer;
`;

const StyledInput = styled(Input)`
  width: 100%;
  display: flex;
`;

const LockIcon = styled(Icon)`
  margin: 0 10px 0 0;
`;

const Fork = styled.div`
  width: 200px;
  text-align: left;

  h3 {
    white-space: nowrap;
    font-weight: 100;
  }

  img {
    width: 22px;
    vertical-align: middle;
    margin-right: 5px;
    border-radius: 3px;
  }
`;

export class SnippetHeader extends React.Component {
  state = {
    showToolbox: true
  };

  toggleToolbox = () => {
    if (!this.props.edit) {
      this.setState((prevState) => ({
        showToolbox: !prevState.showToolbox
      }));
    }
  };

  toggleStar = (id, starred) => (starred ? this.props.unsetStar(id) : this.props.setStar(id));

  deleteSnippet = (id) => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const sure = confirm('Are you sure you want to delete this snippet?');

    if (sure === true) {
      this.props.deleteSnippet(id);

      return true;
    }

    return false;
  };

  prepareAndUpdateSnippet = () => {
    const snippet = get(this.props.match.params.id, this.props.snippets);

    this.props.updateSnippet(prepareFilesForUpdate(this.props.tempSnippet), snippet.id);
  };

  renderStarControl = () => {
    const snippet = get(this.props.match.params.id, this.props.snippets);
    const starred = get('star', snippet);
    const iconType = starred ? 'star-full' : 'star-empty';

    return (
      <UtilityIcon
        size={ 22 }
        color={ this.props.theme.baseAppColor }
        onClick={ () => this.toggleStar(snippet.id, starred) }
        type={ iconType }/>
    );
  };

  countFiles = () => {
    const { edit, match, snippets, tempSnippet } = this.props;

    const snippet = get(match.params.id, snippets);

    let count = size(get('files', snippet));

    if (edit) {
      count = size(get('files', tempSnippet));
    }

    return `${count} File(s)`;
  };

  isEditDisabled = (snippet) => get('truncated', snippet);

  renderEditControls = () => {
    const {
      editSnippet,
      cancelEditSnippet,
      edit,
      addTempFile,
      match,
      snippets,
      theme
    } = this.props;
    const snippet = get(match.params.id, snippets);

    if (this.isEditDisabled(snippet)) {
      return null;
    }

    if (edit) {
      return (
        <React.Fragment>
          <UtilityIcon
            size={ 22 }
            color={ theme.colorSuccess }
            onClick={ () => this.prepareAndUpdateSnippet() }
            type="check"
            text="Save"/>
          <UtilityIcon
            size={ 22 }
            color={ theme.colorDanger }
            onClick={ () => cancelEditSnippet() }
            type="close"
            text="Cancel"/>
          <UtilityIcon
            size={ 22 }
            color={ theme.baseAppColor }
            type="file"
            dropdown
            text={ this.countFiles() }>
            <ul>
              <li>
                <Anchor onClick={ () => addTempFile() }>Add new file</Anchor>
              </li>
            </ul>
          </UtilityIcon>
        </React.Fragment>
      );
    }

    return (
      <UtilityIcon
        size={ 22 }
        color={ theme.baseAppColor }
        onClick={ () => editSnippet(snippet.id) }
        type="edit"/>
    );
  };

  renderSnippetDescription = () => {
    const { edit, tempSnippet, snippets, match, updateTempSnippet } = this.props;
    const snippet = get(match.params.id, snippets);

    if (!edit) {
      return (
        <Description title={ get('description', snippet) }>{get('description', snippet)}</Description>
      );
    }

    return (
      <StyledInput
        value={ get('description', tempSnippet) }
        onChange={ (event) => updateTempSnippet('description', event.target.value) }/>
    );
  };

  renderTitle = () => {
    const { snippets, match, searchByLanguages, searchByTags, edit } = this.props;
    const snippet = get(match.params.id, snippets);

    return (
      <Title
        onMouseOver={ () => this.toggleToolbox() }
        onMouseOut={ () => this.toggleToolbox() }
        onBlur={ () => this.toggleToolbox() }
        onDoubleClick={ (event) =>
          copyToClipboard(
            event,
            get('description', snippet),
            'Snippet description copied to clipboard'
          )
        }
        onFocus={ () => this.toggleToolbox() }>
        {!edit &&
          map(
            (language) => (
              <Languages
                key={ `${language}${snippet.id}` }
                onClick={ () => searchByLanguages(language) }>
                {language}
              </Languages>
            ),
            get('languages', snippet)
          )}
        &nbsp;
        {this.renderSnippetDescription()}
        &nbsp;
        {!edit &&
          map(
            (tag) => (
              <Anchor key={ tag } onClick={ () => searchByTags(tag) }>
                {tag}&nbsp;
              </Anchor>
            ),
            get('tags', snippet)
          )}
      </Title>
    );
  };

  renderHistoryControls = () => {
    const { snippets, match, theme } = this.props;
    const snippet = get(match.params.id, snippets);
    const snippetId = get('id', snippet);
    const snippetUrl = getSnippetUrl('/gist');

    return (
      size(get('history', snippet)) > 1 && (
        <UtilityIcon
          size={ 19 }
          color={ theme.baseAppColor }
          type="time"
          title="View change history"
          dropdown>
          <ul>
            {map(
              (change) => (
                <li key={ change.version }>
                  <ExternalLink
                    href={ `${snippetUrl}/${snippetId}/revisions#diff-${change.version}` }>
                    <History>
                      <div className="changed">
                        <strong>Changed:</strong>
                        <span>{dateFormatToString(change.committed_at)}</span>
                      </div>
                      {!isEmpty(change.change_status) && (
                        <div>
                          <span>
                            <Additions>+</Additions>
                            <span>{change.change_status.additions}</span>
                          </span>
                          <span>
                            <Deletions>-</Deletions>
                            <span>{change.change_status.deletions}</span>
                          </span>
                        </div>
                      )}
                    </History>
                  </ExternalLink>
                </li>
              ),
              drop(1, snippet.history)
            )}
          </ul>
        </UtilityIcon>
      )
    );
  };

  renderFork = () => {
    const { snippets, match, theme } = this.props;
    const snippet = get(match.params.id, snippets);

    return (
      !isEmpty(get('fork', snippet)) && (
        <UtilityIcon
          size={ 22 }
          color={ theme.baseAppColor }
          type="fork"
          title={ `This snippet is forked from ${get('fork.owner.login', snippet)}` }
          dropdown>
          <Fork className="list">
            <div>
              <h3>
                Forked from{' '}
                <img
                  src={ get('fork.owner.avatar_url', snippet) }
                  size={ 22 }
                  alt={ get('fork.owner.login', snippet) }/>
                <strong>{get('fork.owner.login', snippet)}</strong>
              </h3>
              <div>
                <Anchor href={ get('fork.html_url', snippet) }>view original snippet</Anchor>
              </div>
            </div>
          </Fork>
        </UtilityIcon>
      )
    );
  };

  render() {
    const snippetUrl = getSnippetUrl('/gist');
    const { snippets, match, editSnippet, comments } = this.props;
    const snippet = get(match.params.id, snippets);
    const snippetId = get('id', snippet);
    const snippetFiles = get('files', snippet);
    const snippetDescription = get('description', snippet);
    const snippetTags = get('tags', snippet);
    const openOnWebUrl = `${snippetUrl}/${get('username', snippet)}/${snippetId}`;
    const httpCloneUrl = `git clone ${snippetUrl}/${snippetId}.git`;
    const sshCloneUrl = `git clone git@${snippetUrl}:${snippetId}.git`;
    const openInGHDesktop = `x-github-client://openRepo/${snippetUrl}/${snippetId}`;
    const isPublic = get('public', snippet);

    return (
      <SnippetHeaderWrapper>
        {this.renderTitle()}

        <LockIcon
          type={ isPublic ? 'unlock' : 'lock' }
          size={ 22 }
          title={ `Snippet is ${isPublic ? 'public' : 'private'}` }
          color={ this.props.theme.borderColor }/>

        {this.state.showToolbox && (
          <div>
            {this.renderEditControls()}

            {this.renderHistoryControls()}

            {this.renderFork()}

            <UtilityIcon
              size={ 22 }
              color={ this.props.theme.colorDanger }
              onClick={ () => this.deleteSnippet(snippetId) }
              type="delete"/>
            <UtilityIcon
              size={ 22 }
              color={ this.props.theme.baseAppColor }
              type="chat"
              onClick={ () => this.props.toggleSnippetComments() }
              text={
                !isEmpty(comments) ? toString(size(comments)) : toString(get('comments', snippet))
              }/>
            <UtilityIcon
              size={ 22 }
              color={ this.props.theme.baseAppColor }
              type="copy"
              title="Copy Snippet URL to clipboard"
              onClick={ (event) =>
                copyToClipboard(event, openOnWebUrl, 'Snippet URL copied to clipboard')
              }/>
            {this.renderStarControl(snippet)}

            <UtilityIcon size={ 22 } color={ this.props.theme.baseAppColor } type="ellipsis" dropdown>
              <ul>
                {!this.isEditDisabled(snippet) && (
                  <li>
                    <Anchor onClick={ () => editSnippet(snippetId) }>Edit</Anchor>
                  </li>
                )}
                <li>
                  <ExternalLink href={ openOnWebUrl }>Open on web</ExternalLink>
                </li>
                <li>
                  <Anchor
                    onClick={ () =>
                      this.props.createSnippet({
                        description: `${snippetDescription} ${DEFAULT_SNIPPET_DUPLICATE_SUFFIX} ${
                          isArray(snippetTags) ? snippetTags.join(', ') : ''
                        }`,
                        files: prepareFilesForDuplication(snippetFiles),
                        isPublic
                      })
                    }>
                    Duplicate
                  </Anchor>
                </li>
                <li>
                  <Anchor href={ `${openOnWebUrl}/download` }>Download</Anchor>
                </li>
                <li className="color-danger">
                  <Anchor onClick={ () => this.deleteSnippet(snippetId) }>Delete</Anchor>
                </li>
                <li>
                  <Anchor
                    onClick={ (event) =>
                      copyToClipboard(event, snippetId, 'Snippet ID copied to clipboard')
                    }>
                    Copy snippet ID to clipboard
                  </Anchor>
                </li>
                <li>
                  <Anchor
                    onClick={ (event) =>
                      copyToClipboard(event, openOnWebUrl, 'Snippet URL copied to clipboard')
                    }>
                    Copy Snippet URL to clipboard
                  </Anchor>
                </li>
                <li>
                  <Anchor
                    onClick={ (event) =>
                      copyToClipboard(
                        event,
                        httpCloneUrl,
                        'HTTPS clone command copied to clipboard'
                      )
                    }>
                    Copy HTTPS clone command to clipboard
                  </Anchor>
                </li>
                <li>
                  <Anchor
                    onClick={ (event) =>
                      copyToClipboard(event, sshCloneUrl, 'SSH clone command copied to clipboard')
                    }>
                    Copy SSH clone command to clipboard
                  </Anchor>
                </li>
                <li>
                  <ExternalLink href={ openInGHDesktop }>Open in GitHub desktop</ExternalLink>
                </li>
                {!isEnterpriseLogin() && (
                  <React.Fragment>
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
                    <li>
                      <ExternalLink href={ `https://carbon.now.sh/${snippetId}` }>
                        Open in carbon.now.sh
                      </ExternalLink>
                    </li>
                  </React.Fragment>
                )}
              </ul>
            </UtilityIcon>
          </div>
        )}
      </SnippetHeaderWrapper>
    );
  }
}

const mapStateToProps = (state, { match }) => ({
  snippets: get(['snippets', 'snippets'], state),
  comments: get(['snippets', 'comments', match.params.id], state),
  edit: get(['ui', 'snippets', 'edit'], state),
  theme: get(['ui', 'settings', 'theme'], state),
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
  theme: PropTypes.object,
  comments: PropTypes.array,
  createSnippet: PropTypes.func
};

export default connect(
  mapStateToProps,
  {
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
    toggleSnippetComments: snippetActions.toggleSnippetComments,
    createSnippet: snippetActions.createSnippet
  }
)(SnippetHeader);
