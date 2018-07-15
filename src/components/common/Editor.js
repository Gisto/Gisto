import React from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';
import { syntaxMap } from 'constants/editor';
import marked from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import styled from 'styled-components';

const Markdown = styled.div`
  padding: 20px 30px;
`;

export class Editor extends React.Component {
  renderEditor = (options) => {
    const {
      edit, onChange, file, className, id, language
    } = this.props;

    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: (code) => hljs.highlightAuto(code).value,
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false
    });

    if (!edit && file.content && file.language === 'Markdown') {
      const html = marked(file.content) || '';

      return (
        <Markdown className="markdown-body" dangerouslySetInnerHTML={ { __html: html } }/>
      );
    }

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
  };

  render() {
    const options = {
      selectOnLineNumbers: true,
      roundedSelection: false,
      scrollBeyondLastLine: false,
      minimap: {
        enabled: false
      },
      automaticLayout: true
    };

    return this.renderEditor(options);
  }
}

Editor.propTypes = {
  file: PropTypes.object,
  onChange: PropTypes.func,
  language: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  edit: PropTypes.bool
};

export default Editor;
