import React from 'react';
import PropTypes from 'prop-types';
import styled, { css, withTheme } from 'styled-components';

import MonacoEditor from 'react-monaco-editor';
import { registerRulesForLanguage } from 'monaco-ace-tokenizer';

import AdaHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/ada';
import ClojureHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/clojure';
import CobolHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/cobol';
import DHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/d';
import ElixirHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/elixir';
import ErlangHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/erlang';
import FortranHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/fortran';
import GroovyHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/groovy';
import HaskellHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/haskell';
import JuliaHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/julia';
import KotlinHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/kotlin';
import OcamlHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/ocaml';
import PascalHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/pascal';
import PerlHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/perl';
import RacketHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/racket';
import SbclHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/sbcl';
import ScalaHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/scala';
import TclHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/tcl';

import { getSetting } from 'utils/settings';
import { getFileExtension } from 'utils/string';

import { syntaxMap } from 'constants/editor';

import 'highlight.js/styles/default.css';

import Loading from 'components/common/Loading';
import Markdown from 'components/common/Markdown';
import Asciidoc from 'components/common/Asciidoc';
import Csv from 'components/common/Csv';
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
  color: ${(props) => props.theme.baseAppColor};
`;

const Image = styled.div`
  text-align: center;
  
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

  isCSV = (file) => file.language === 'CSV';

  editorWillMount = (monaco) => {
    monaco.languages.register({ id: 'ada' });
    monaco.languages.register({ id: 'clojure' });
    monaco.languages.register({ id: 'cobol' });
    monaco.languages.register({ id: 'd' });
    monaco.languages.register({ id: 'elixir' });
    monaco.languages.register({ id: 'erlang' });
    monaco.languages.register({ id: 'fortran' });
    monaco.languages.register({ id: 'groovy' });
    monaco.languages.register({ id: 'haskell' });
    monaco.languages.register({ id: 'julia' });
    monaco.languages.register({ id: 'kotlin' });
    monaco.languages.register({ id: 'ocaml' });
    monaco.languages.register({ id: 'pascal' });
    monaco.languages.register({ id: 'perl' });
    monaco.languages.register({ id: 'racket' });
    monaco.languages.register({ id: 'sbcl' });
    monaco.languages.register({ id: 'scala' });
    monaco.languages.register({ id: 'tcl' });

    registerRulesForLanguage('ada', new AdaHighlightRules());
    registerRulesForLanguage('clojure', new ClojureHighlightRules());
    registerRulesForLanguage('cobol', new CobolHighlightRules());
    registerRulesForLanguage('d', new DHighlightRules());
    registerRulesForLanguage('elixir', new ElixirHighlightRules());
    registerRulesForLanguage('erlang', new ErlangHighlightRules());
    registerRulesForLanguage('fortran', new FortranHighlightRules());
    registerRulesForLanguage('groovy', new GroovyHighlightRules());
    registerRulesForLanguage('haskell', new HaskellHighlightRules());
    registerRulesForLanguage('julia', new JuliaHighlightRules());
    registerRulesForLanguage('kotlin', new KotlinHighlightRules());
    registerRulesForLanguage('ocaml', new OcamlHighlightRules());
    registerRulesForLanguage('pascal', new PascalHighlightRules());
    registerRulesForLanguage('perl', new PerlHighlightRules());
    registerRulesForLanguage('racket', new RacketHighlightRules());
    registerRulesForLanguage('sbcl', new SbclHighlightRules());
    registerRulesForLanguage('scala', new ScalaHighlightRules());
    registerRulesForLanguage('tcl', new TclHighlightRules());
  };

  renderEditor = () => {
    const {
      edit, onChange, file, className, id, language, filesCount, isNew, theme
    } = this.props;

    if (!isNew && !file.content && !edit) {
      return (
        <LoadingIndicator>
          <Loading color={ theme.baseAppColor } text=""/>
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

    if (this.isCSV(file)) {
      if (file.collapsed) {
        return null;
      }

      if (!edit && !isNew  && !file.collapsed) {
        return (
          <Csv text={ file.content }/>
        );
      }
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
        editorWillMount={ this.editorWillMount }
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
  theme: PropTypes.object,
  onChange: PropTypes.func,
  language: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  edit: PropTypes.bool,
  filesCount: PropTypes.number,
  isNew: PropTypes.bool
};

export default withTheme(Editor);
