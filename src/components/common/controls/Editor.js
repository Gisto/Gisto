import React from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';
import styled, { css } from 'styled-components';
import { getSetting } from 'utils/settings';
import { getFileExtension } from 'utils/string';
import { syntaxMap } from 'constants/editor';
import { baseAppColor } from 'constants/colors';

import 'highlight.js/styles/default.css';

import Loading from 'components/common/Loading';
import Markdown from 'components/common/Markdown';
import Asciidoc from 'components/common/Asciidoc';
import Anchor from 'components/common/Anchor';

const RenderedComponent = css`
  padding: 20px 30px;
  ${(props) => props.width && `width: calc(${props.width} - 60px);`}
`;

const MarkdownComponent = styled(Markdown)`
  ${RenderedComponent}
`;

const AsciidocComponent = styled(Asciidoc)`
  ${RenderedComponent}
`;

const EditorWrapper = styled.span`
  display: inline-flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
`;

const LoadingIndicator = styled.div`
  padding: 20px;
  color: ${baseAppColor};
`;

const Image = styled.div`
  text-align: center;
  padding: 20px;
  
  img {
    max-width: 100%;
  }
`;

const BigFile = styled.div`
  margin: 20px;
`;

const StyledAnchor = styled(Anchor)`
  text-decoration: underline;
`;

const editorOptions = (options) => ({
  selectOnLineNumbers: Boolean(getSetting('selectOnLineNumbers', false)),
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
    enabled: Boolean(getSetting('minimap', false))
  },
  automaticLayout: true,
  ...options
});

export class Editor extends React.Component {
  isMarkDown = (file) => {
    return file.language === 'Markdown'
      || getFileExtension(file.filename) === 'md'
      || getFileExtension(file.filename) === 'markdown'
      || getFileExtension(file.name) === 'md'
      || getFileExtension(file.name) === 'markdown';
  };

  isAsciiDoc = (file) => {
    return file.language === 'AsciiDoc'
      || getFileExtension(file.filename) === 'adoc'
      || getFileExtension(file.filename) === 'asciidoc'
      || getFileExtension(file.name) === 'adoc'
      || getFileExtension(file.name) === 'asciidoc';
  };

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

    if (file.content && file.language === 'Image' && !file.collapsed) {
      return (
        <Image>
          <img id="img" src={ file.raw_url } title={ `File type: ${file.type}` } alt={ `File type: ${file.type}` }/>
        </Image>
      );
    }

    if (!file.collapsed && file.truncated) {
      return (
        <BigFile>
          This file has been truncated, it contains { file.size } characters.
          <br/>
          You can view the <StyledAnchor href={ file.raw_url }>full file</StyledAnchor> on web.
        </BigFile>
      );
    }

    if (this.isAsciiDoc(file)) {
      if (file.collapsed) {
        return null;
      }

      if (!edit && !isNew  && !file.collapsed) {
        return (
          <AsciidocComponent text={ file.content }/>
        );
      }

      const calculatedHeight = filesCount === 1 ? window.outerHeight - 220 : 300;

      return (
        <EditorWrapper>
          <MonacoEditor
            width="50%"
            height={ calculatedHeight }
            className={ className }
            language="AsciiDoc"
            theme={ getSetting('editorTheme', 'vs') }
            name={ id }
            value={ file.content }
            options={ editorOptions() }
            onChange={ onChange }/>
          <AsciidocComponent width="50%" text={ file.content }/>
        </EditorWrapper>
      );
    }

    if (this.isMarkDown(file)) {
      if (file.collapsed) {
        return null;
      }

      if (!edit && !isNew  && !file.collapsed) {
        return (
          <MarkdownComponent text={ file.content }/>
        );
      }

      const calculatedHeight = filesCount === 1 ? window.outerHeight - 220 : 300;

      return (
        <EditorWrapper>
          <MonacoEditor
            width="50%"
            height={ calculatedHeight }
            className={ className }
            language="Markdown"
            theme={ getSetting('editorTheme', 'vs') }
            name={ id }
            value={ file.content }
            options={ editorOptions() }
            onChange={ onChange }/>
          <MarkdownComponent width="50%" text={ file.content }/>
        </EditorWrapper>
      );
    }

    const calculatedHeight = filesCount === 1 ? window.outerHeight - 220 : 400;

    return (
      <span style={ { display: file.collapsed ? 'none' : 'inherit' } }>
        <MonacoEditor
        width="100%"
        height={ calculatedHeight }
        className={ className }
        language={ language || syntaxMap[file.language] || 'text' }
        theme={ getSetting('editorTheme', 'vs') }
        name={ id }
        value={ file.content }
        options={ editorOptions() }
        onChange={ onChange }/>
      </span>
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
