import React from 'react';
import PropTypes from 'prop-types';
import styled, { css, withTheme } from 'styled-components';
import MonacoEditor from 'react-monaco-editor';
import { registerRulesForLanguage } from 'monaco-ace-tokenizer';
import { toPairs } from 'lodash/fp';

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

import themeList from 'monaco-themes/themes/themelist';

import { getSetting, getSession, setSession } from 'utils/settings';
import {
  isAsciiDoc,
  isCSV,
  isGeoJson,
  isMarkDown,
  isPDF,
  isImage,
  isTSV,
  isHTML,
  isLaTex,
  isOpenApi
} from 'utils/files';

import { syntaxMap } from 'constants/editor';

import 'highlight.js/styles/default.css';

import Loading from 'components/common/Loading';
import Anchor from 'components/common/Anchor';

import Markdown from 'components/common/editor/Markdown';
import Asciidoc from 'components/common/editor/Asciidoc';
import Csv from 'components/common/editor/Csv';
import GeoJson from 'components/common/editor/GeoJson';
import Pdf from 'components/common/editor/Pdf';
import Html from 'components/common/editor/Html';
import LaTex from 'components/common/editor/LaTex';
import OpenApi from 'components/common/editor/OpenApi';

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
  formatOnType: Boolean(getSetting('settings-editor-formatOnType', false)),
  fontFamily: getSetting('fontFamily', 'monospace'),
  lineHeight: getSetting('lineHeight', 21),
  fontLigatures: getSetting('fontLigatures', false),
  fontSize: getSetting('fontSize', 12),
  roundedSelection: false,
  scrollBeyondLastLine: false,
  wordWrap: getSetting('settings-editor-wordWrap', 'bounded'),
  wordWrapColumn: getSetting('settings-editor-wordWrapColumn', 80),
  minimap: {
    enabled: Boolean(getSetting('minimap', false))
  },
  automaticLayout: true,
  ...options
});

export class Editor extends React.Component {
  editorDidMount = (editor, monaco) => {
    setSession('monaco-extra-langs-registred', true);

    toPairs(themeList).map((theme) =>
      import(`monaco-themes/themes/${theme[1]}`).then((data) =>
        monaco.editor.defineTheme(theme[0], data)
      )
    );

    monaco.editor.setTheme(getSetting('editorTheme', 'vs'));

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

  renderMonacoEdito = (width, height, language = this.props.language) => (
    <MonacoEditor
      width={ width }
      height={
        getSetting('editor-fit-to-content', false) && !this.props.isNew && !this.props.edit
          ? false
          : height
      }
      className={ this.props.className }
      language={ language || syntaxMap[this.props.file.language] || 'text' }
      theme={ getSetting('editorTheme', 'vs') }
      name={ this.props.id }
      value={ this.props.file.content }
      options={ editorOptions({ readOnly: !this.props.edit && !this.props.isNew }) }
      // eslint-disable-next-line no-extra-boolean-cast
      editorDidMount={ (editor, monaco) => {
        const fitContentHeight = editor.getModel().getLineCount() * getSetting('lineHeight', 21);

        // eslint-disable-next-line no-param-reassign
        editor.getDomNode().style.height = `${
          getSetting('editor-fit-to-content', false) && !this.props.isNew && !this.props.edit
            ? fitContentHeight
            : height
        }px`;
        editor.layout();

        return getSession('monaco-extra-langs-registred')
          ? null
          : this.editorDidMount(editor, monaco);
      } }
      onChange={ this.props.onChange }/>
  );

  renderEditor = () => {
    const { edit, file, filesCount, isNew, theme } = this.props;

    if (file.collapsed) {
      return null;
    }

    if (!isNew && !file.content && !edit) {
      return (
        <LoadingIndicator>
          <Loading color={ theme.baseAppColor } text=""/>
        </LoadingIndicator>
      );
    }

    if (
      file.content &&
      Boolean(getSetting('settings-editor-preview-image', false)) &&
      isImage(file) &&
      !file.collapsed
    ) {
      return (
        <Image>
          <img
            id="img"
            src={ file.raw_url }
            title={ `File type: ${file.type}` }
            alt={ `File type: ${file.type}` }/>
        </Image>
      );
    }

    if (!file.collapsed && file.truncated) {
      return (
        <BigFile>
          This file has been truncated, it contains {file.size} characters.
          <br/>
          You can view the <StyledAnchor href={ file.raw_url }>full file</StyledAnchor> on web.
        </BigFile>
      );
    }

    if (Boolean(getSetting('settings-editor-preview-csv', false)) && (isCSV(file) || isTSV(file))) {
      if (!edit && !isNew) {
        return <Csv text={ file.content }/>;
      }
    }

    if (Boolean(getSetting('settings-editor-preview-open-api', false)) && isOpenApi(file)) {
      return <OpenApi url={ file.raw_url }/>;
    }

    if (Boolean(getSetting('settings-editor-preview-html', false)) && isHTML(file)) {
      if (!edit && !isNew) {
        return <Html file={ file }/>;
      }
    }

    if (Boolean(getSetting('settings-editor-preview-latex', false)) && isLaTex(file)) {
      if (!edit && !isNew) {
        return <LaTex text={ file.content }/>;
      }
    }

    if (
      Boolean(getSetting('settings-editor-preview-pdf', false)) &&
      isPDF(file) &&
      navigator.onLine
    ) {
      if (!isNew) {
        return <Pdf file={ file }/>;
      }
    }

    if (
      Boolean(getSetting('settings-editor-preview-geojson', false)) &&
      isGeoJson(file) &&
      navigator.onLine
    ) {
      if (!edit && !isNew && !file.collapsed) {
        return <GeoJson file={ file }/>;
      }
    }

    if (Boolean(getSetting('settings-editor-preview-asciidoc', false)) && isAsciiDoc(file)) {
      if (!edit && !isNew && !file.collapsed) {
        return <AsciidocComponent text={ file.content }/>;
      }

      const calculatedHeight = filesCount === 1 ? window.outerHeight - 220 : 300;

      return (
        <EditorWrapper>
          {this.renderMonacoEdito('50%', calculatedHeight, 'AsciiDoc')}
          <AsciidocComponent width="50%" text={ file.content }/>
        </EditorWrapper>
      );
    }

    if (Boolean(getSetting('settings-editor-preview-markdown', false)) && isMarkDown(file)) {
      if (!edit && !isNew && !file.collapsed) {
        return <MarkdownComponent text={ file.content }/>;
      }

      const calculatedHeight = filesCount === 1 ? window.outerHeight - 220 : 300;

      return (
        <EditorWrapper>
          {this.renderMonacoEdito('50%', calculatedHeight, 'Markdown')}
          <MarkdownComponent width="50%" text={ file.content }/>
        </EditorWrapper>
      );
    }

    const calculatedHeight = filesCount === 1 ? window.outerHeight - 220 : 'calc(100vh - 235px)';

    return (
      <span style={ { display: file.collapsed ? 'none' : 'inherit' } }>
        {this.renderMonacoEdito('100%', calculatedHeight)}
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
