import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, join } from 'lodash/fp';
import * as snippetActions from 'actions/snippets';
import { removeTags } from 'utils/tags';

export class Snippet extends React.Component {
  componentDidMount() {
    this.props.getSnippet(this.props.match.params.id || this.props.snippet.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.getSnippet(this.props.match.params.id || this.props.snippet.id);
    }
  }

  render() {
    const { snippet, match } = this.props;

    return (
      <React.Fragment>
        <strong>{ removeTags(get('description', snippet)) }</strong>
        <div>ID: { match.params.id }</div>
        <div>Tags: { join(', ', get('tags', snippet)) }</div>
        <div>Star: { get('star', snippet) ? 'true' : 'false' }</div>
        <div>Languages: { join(', ', get('languages', snippet)) }</div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const snippetId = ownProps.match.params.id;

  return {
    snippet: get(['snippets', 'snippets', snippetId], state)
  };
};

Snippet.propTypes = {
  match: PropTypes.object,
  snippet: PropTypes.object,
  getSnippet: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  getSnippet: snippetActions.getSnippet
})(Snippet);
