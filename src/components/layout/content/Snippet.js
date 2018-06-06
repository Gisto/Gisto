import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { get, map } from 'lodash/fp';
import AceEditor from 'react-ace';
import * as snippetActions from 'actions/snippets';
import { borderColor } from 'constants/colors';
import SnippetHeader from 'components/layout/content/snippet/snippetHeader';

import 'brace/theme/chrome';
import 'brace/mode/javascript';

const SnippetWrapper = styled.div`
  background: #fff;
  font-weight: 200;
  width: auto;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  box-shadow: 0 0 10px ${borderColor};
  flex: 1;
  margin-bottom: 20px;
`;

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
    const { snippet } = this.props;

    return (
      <React.Fragment>
        { map((file) => (
          <SnippetWrapper key={ file.filename }>
            <SnippetHeader file={ file } username={ snippet.username } snippetId={ snippet.id }/>
            <AceEditor
                mode="javascript"
                value={ file.content }
                width="100%"
                setOptions={ {
                  showLineNumbers: true,
                  tabSize: 2,
                  maxLines: 15
                } }
                theme="github"/>
          </SnippetWrapper>
        ), get('files', snippet)) }
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
