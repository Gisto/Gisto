import React from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';
import styled from 'styled-components';
import { getSetting } from 'utils/settings';
import { syntaxMap } from 'constants/editor';
import { baseAppColor } from 'constants/colors';

import 'highlight.js/styles/default.css';

import Loading from 'components/common/Loading';
import Markdown from 'components/common/Markdown';

const MarkdownComponent = styled(Markdown)`
  padding: 20px 30px;
  ${(props) => props.width && `width: calc(${props.width} - 60px);`}
`;

const EditorWrapper = styled.span`
  display: inline-flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const LoadingIndicator = styled.div`
  padding: 20px;
  color: ${baseAppColor};
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
      edit, onChange, file, className, id, language, filesCount, isNew
    } = this.props;

    if (!isNew && !file.content && !edit) {
      return (
        <LoadingIndicator>
          <Loading color={ baseAppColor } text=""/>
        </LoadingIndicator>
      );
    }

    if (file.content && file.language === 'Markdown') {
      if (!edit) {
        return (
          <MarkdownComponent text={ file.content }/>
        );
      }

      return (
        <EditorWrapper>
          <MonacoEditor
            width="50%"
            height={ file.collapsed ? 0 : 'auto' }
            className={ className }
            language={ language || syntaxMap[file.language] || 'text' }
            theme={ getSetting('editorTheme', 'vs') }
            name={ id }
            value={ file.content }
            options={ editorOptions }
            onChange={ onChange }/>
          <MarkdownComponent width="50%" text={ file.content }/>
        </EditorWrapper>
      );
    }

    const calculatedHeight = filesCount === 1 ? window.outerHeight - 220 : 400;

    return (
      <MonacoEditor
        width="100%"
        height={ file.collapsed ? 0 : calculatedHeight }
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
  edit: PropTypes.bool,
  filesCount: PropTypes.number,
  isNew: PropTypes.bool
};

export default Editor;
