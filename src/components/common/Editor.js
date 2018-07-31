import React from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';
import marked from 'marked';
import styled from 'styled-components';
import hljs from 'highlight.js';
import { getSetting } from 'utils/settings';
import { syntaxMap } from 'constants/editor';

import 'highlight.js/styles/default.css';

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
  selectOnLineNumbers: Boolean(getSetting('selectOnLineNumbers')),
  lineNumbers: getSetting('lineNumbers', true),
  codeLens: getSetting('codeLens', false),
  cursorBlinking: getSetting('cursorBlinking', 'blink'),
  formatOnPaste: Boolean(getSetting('formatOnPaste', false)),
  fontFamily: getSetting('fontFamily', 'monospace'),
  lineHeight: getSetting('lineHeight', 21),
  fontLigatures: getSetting('fontLigatures', false),
  fontSize: getSetting('fontSize', 12),
  roundedSelection: false,
  scrollBeyondLastLine: false,
  minimap: {
    enabled: Boolean(getSetting('minimap'))
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
      sanitize: false,
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
            theme={ getSetting('editorTheme', 'vs') }
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
        height={ 400 }
        className={ className }
        language={ language || syntaxMap[file.language] || 'text' }
        theme={ getSetting('editorTheme', '') }
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
