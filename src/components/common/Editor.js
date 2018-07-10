import React from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';
import { syntaxMap } from 'constants/editor';

export class Editor extends React.Component {
  state = {};

  render() {
    const {
      file, language, onChange, id, className
    } = this.props;
    const options = {
      selectOnLineNumbers: true,
      roundedSelection: false,
      scrollBeyondLastLine: false,
      minimap: {
        enabled: false
      },
      automaticLayout: true
    };

    return (
      <MonacoEditor
        width="100%"
        height="400"
        className={ className }
        language={ language || syntaxMap[file.language] || 'text' }
        theme="vs"
        name={ id }
        value={ file.content }
        options={ options }
        onChange={ onChange }/>
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
