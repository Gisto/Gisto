import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  get, isEmpty, map, size, orderBy
} from 'lodash/fp';
import marked from 'marked';
import 'highlight.js/styles/default.css';
import hljs from 'highlight.js';

import Icon from 'components/common/Icon';
import TextArea from 'components/common/TextArea';
import Button from 'components/common/Button';
import styled from 'styled-components';

import {
  baseAppColor, colorDanger, headerBgLightest, headerColor, textColor
} from 'constants/colors';

import * as snippetActions from 'actions/snippets';

const CommentsWrapper = styled.div`
  margin: 0;
  background: ${headerBgLightest};
  top: 0;
  position: absolute;
  height: 100%;
  z-index: 1;
  width: 460px;
  box-shadow: 0 1px 2px #555;
  padding: 0 20px;
  transition: all 0.5s ease;
  right: ${(props) => props.show ? '0px' : '-500px'};
  color: ${textColor};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  h3 {
    font-weight: 300;
    font-size: 22px;
  }
  
  h4 {
    font-weight: 300;
    font-size: 16px;
  }
`;

const NoComments = styled.p`
  text-align: center;
`;

const CommentsList = styled.div`
  flex: 1;
  overflow: auto;
`;

const Comment = styled.div`
  padding: 0 0 0 30px;
  border-left: 2px solid ${baseAppColor};
  position: relative;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
`;

const Avatar = styled.img`
  border-radius: 4px;
  border: 1px solid ${headerColor};
  margin: 0 20px 0 0;
`;

const StyledDeleteIcon = styled(Icon)`
  position: absolute;
  right: 20px;
  cursor: pointer;
`;

const NewComment = styled.div`
  margin-bottom: 20px;
`;


export class Comments extends React.Component {
  state = {
    newCommentBody: ''
  };

  componentDidMount() {
    this.props.getSnippetComments(this.props.snippetId);
  }

  handleTextAreaChange = (newCommentBody) => this.setState({ newCommentBody });

  createComment = () => {
    this.props.createSnippetComment(this.props.snippetId, this.state.newCommentBody);
    this.setState({ newCommentBody: '' });
  };

  render() {
    const {
      comments, showComments, snippetId, deleteComment
    } = this.props;

    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: (code) => hljs.highlightAuto(code).value,
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    });

    return (
      <CommentsWrapper show={ showComments }>
        <h3><Icon type="chat" color={ textColor }/> { size(comments) } Comment(s)</h3>

        <CommentsList>
          { isEmpty(comments)
            ? <NoComments>No comments to display</NoComments>
            : map((comment) => {
              const html = marked(comment.body) || '';

              return (
                <Comment key={ comment.id }>
                  <StyledDeleteIcon type="delete"
                                    color={ colorDanger  }
                                    onClick={ () => deleteComment(snippetId, comment.id) }/>
                  <CommentHeader>
                    <Avatar
                      title={ comment.user.login }
                      src={ comment.user.avatar_url }
                      width="32"
                      height="32"/>
                    <span>by: { comment.user.login }<br/>{ comment.updated_at }</span>
                  </CommentHeader>
                  <div className="markdown-body" dangerouslySetInnerHTML={ { __html: html } }/>
                </Comment>
              );
            }, orderBy((comment) => new Date(comment.updated_at), 'desc', comments))
          }
        </CommentsList>

        <NewComment>
          <h4>Add new</h4>
          <TextArea placeholder="Content"
                    value={ this.state.newCommentBody }
                    onChange={ (event) => this.handleTextAreaChange(event.target.value) }/>
          <Button icon="add"
                  onClick={ () => this.createComment() }>
            Add new comment
          </Button>
        </NewComment>

      </CommentsWrapper>
    );
  }
}

const mapStateToProps = (state, { snippetId }) => ({
  comments: get(['snippets', 'comments', snippetId], state),
  showComments: get(['ui', 'snippets', 'comments'], state)
});

Comments.propTypes = {
  showComments: PropTypes.any,
  comments: PropTypes.any,
  snippetId: PropTypes.string,
  getSnippetComments: PropTypes.func,
  createSnippetComment: PropTypes.func,
  deleteComment: PropTypes.func
};

export default connect(mapStateToProps, {
  getSnippetComments: snippetActions.getSnippetComments,
  createSnippetComment: snippetActions.createSnippetComment,
  deleteComment: snippetActions.deleteComment
})(Comments);
