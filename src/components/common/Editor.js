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
  ${(props) => props.width && `width: calc(${props.width} - 60px);`}
`;

const EditorWrapper = styled.span`
  display: inline-flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const editorOptions = {
  selectOnLineNumbers: true,
  roundedSelection: false,
  scrollBeyondLastLine: false,
  minimap: {
    enabled: false
  },
  automaticLayout: true
};

export class Editor extends React.Component {
  renderEditor = () => {
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

    if (file.content && file.language === 'Markdown') {
      const html = marked(file.content) || '';

      if (!edit) {
        return (
          <Markdown className="markdown-body" dangerouslySetInnerHTML={ { __html: html } }/>
        );
      }

      return (
        <EditorWrapper>
          <MonacoEditor
            width="50%"
            height="auto"
            className={ className }
            language={ language || syntaxMap[file.language] || 'text' }
            theme="vs"
            name={ id }
            value={ file.content }
            options={ editorOptions }
            onChange={ onChange }/>
          <Markdown width="50%" className="markdown-body" dangerouslySetInnerHTML={ { __html: html } }/>
        </EditorWrapper>
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
        options={ editorOptions }
        onChange={ onChange }/>
    );
  };

  render() {
    return this.renderEditor();
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
