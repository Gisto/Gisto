import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import { syntaxMap } from 'constants/editor';

import 'brace/theme/chrome';
import 'brace/mode/javascript';
import 'brace/mode/markdown';

export class Editor extends React.Component {
  state = {};

  render() {
    const {
      file, language, onChange, id, className
    } = this.props;

    return (
      <AceEditor
        mode={ language || syntaxMap[file.language] || 'text' }
        value={ file.content }
        className={ className }
        width="100%"
        onChange={ onChange }
        name={ id }
        setOptions={ {
          showLineNumbers: true,
          tabSize: 2,
          maxLines: 15,
          minLines: 10
        } }
        theme="github"/>
    );
  }
}

Editor.propTypes = {
  file: PropTypes.object,
  onChange: PropTypes.func,
  language: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string
};

export default Editor;
