import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  get, map, size, toString, isEmpty, join, drop
} from 'lodash/fp';
import styled from 'styled-components';

import {
  baseAppColor, colorDanger, colorSuccess, textColor
} from 'constants/colors';
import * as snippetActions from 'actions/snippets';
import { copyToClipboard, prepareFilesForUpdate } from 'utils/snippets';
import { dateFormateToString } from 'utils/date';

import UtilityIcon from 'components/common/UtilityIcon';
import Input from 'components/common/controls/Input';
import Anchor from 'components/common/Anchor';
import ExternalLink from 'components/common/ExternalLink';
import { getSnippetUrl } from 'utils/url';
import { isEnterpriseLogin } from 'utils/login';

const SnippetHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const History = styled.span`
  div {
    color: ${baseAppColor};
    display: flex;
    margin: 10px 0;
    justify-content: space-between;
    
    &.changed {
      width: 230px;    
    }
  }
`;

const Additions = styled.span`
  background: ${colorSuccess};
  color: #fff;
  padding: 0 5px;
  
  + span {
    margin: 0 0 0 10px;
  }
`;

const Deletions = styled.span`
  background: ${colorDanger};
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

const StyledInput = styled(Input)`
  width: 100%;
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

  toggleStar = (id, starred) => starred ? this.props.unsetStar(id) : this.props.setStar(id);

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
        <Description title={ get('description', snippet) }>
          {get('description', snippet)}
        </Description>
      );
    }

    return (
      <StyledInput value={ `${get('description', tempSnippet)} ${join(' ', get('tags', snippet))}` }
                   onChange={ (event) => updateTempSnippet('description', event.target.value) }/>
    );
  };

  renderTitle = () => {
    const {
      snippets, match, searchByLanguages, searchByTags, edit
    } = this.props;
    const snippet = get(match.params.id, snippets);

    return (
      <Title onMouseOver={ () => this.toggleToolbox() }
             onMouseOut={ () => this.toggleToolbox() }
             onBlur={ () => this.toggleToolbox() }
             onFocus={ () => this.toggleToolbox() }>
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
    const snippetUrl = getSnippetUrl('/gist');
    const {
      snippets, match, editSnippet, comments
    } = this.props;
    const snippet = get(match.params.id, snippets);
    const snippetId = get('id', snippet);
    const openOnWebUrl = `${snippetUrl}/${get('username', snippet)}/${snippetId}`;
    const httpCloneUrl = `git clone ${snippetUrl}/${snippetId}.git`;
    const sshCloneUrl = `git clone git@${snippetUrl}:${snippetId}.git`;
    const openInGHDesktop = `x-github-client://openRepo/${snippetUrl}/${snippetId}`;

    return (
      <SnippetHeaderWrapper>

        { this.renderTitle() }

        { this.state.showToolbox && (
          <div>

            { this.renderEditControls() }

            <UtilityIcon size={ 22 } color={ baseAppColor } type={ get('public', snippet) ? 'unlock' : 'lock' }/>
            { size(get('history', snippet)) > 1 && (
              <UtilityIcon size={ 22 } color={ baseAppColor } type="time" dropdown>
                <ul>
                  { map((change) => (
                    <li key={ change.version }>
                      <ExternalLink href={
                        `${snippetUrl}/${change.user.login}/${snippetId}/revisions#diff-${change.version}`
                      }>
                        <History>
                          <div className="changed">
                            <strong>Changed:</strong>
                            <span>{ dateFormateToString(change.committed_at) }</span>
                          </div>
                          { !isEmpty(change.change_status) && (
                            <div>
                              <span>
                                <Additions>+</Additions>
                                <span>
                                  { change.change_status.additions }
                                </span>
                              </span>
                              <span>
                                <Deletions>-</Deletions>
                                <span>
                                  { change.change_status.deletions }
                                </span>
                              </span>
                            </div>
                          ) }
                        </History>
                      </ExternalLink>
                    </li>
                  ), drop(1, snippet.history)) }
                </ul>
              </UtilityIcon>
            ) }
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
                { !isEnterpriseLogin() && (
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
                  </React.Fragment>
                ) }
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
  comments: PropTypes.array
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
