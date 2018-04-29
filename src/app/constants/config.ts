export const logoText = `</Gisto>`;
export const tagRegex = /#(\d*[A-Za-z_0-9]+\d*)/g;
export const defaultSnippetDescription = 'untitled';
export const minimumCharactersToTriggerSearch = 2;
export const gitHubTokenKeyInStorage = 'github-api-key';
export const gitHubEnterpriseDomainInStorage = 'github-enterprise-url';

export const defaultURL = `https://github.com`;
export const defaultAPIEndpointURL = `https://api.github.com`;
export const defaultGistURL = `https://gist.github.com`;

export const editorConfig = (readOnly = false) => ({
  selectionStyle: 'line',
  highlightActiveLine: true,
  highlightSelectedWord: true,
  readOnly,
  cursorStyle: 'ace',
  mergeUndoDeltas: 'always',
  behavioursEnabled: true,
  wrapBehavioursEnabled: true,
  // this is needed if editor is inside scrollable page
  autoScrollEditorIntoView: true,
  // copy/cut the full line if selection is empty, defaults to false
  copyWithEmptySelection: true,
  navigateWithinSoftTabs: false,
  hScrollBarAlwaysVisible: false,
  vScrollBarAlwaysVisible: true,
  highlightGutterLine: true,
  animatedScroll: true,
  showInvisibles: false,
  showPrintMargin: true,
  printMarginColumn: 100,
  // shortcut for showPrintMargin and printMarginColumn
  printMargin: true,
  fadeFoldWidgets: true,
  showFoldWidgets: true,
  showLineNumbers: true,
  showGutter: true,
  displayIndentGuides: true,
  fontSize: 13,
  fontFamily: 'Monaco, monospace',
  // resize editor based on the contents of the editor until the number of lines reaches maxLines
  // maxLines: 20,
  // minLines: 3,
  // number of page sizes to scroll after document end (typical values are 0, 0.5, and 1)
  scrollPastEnd: 1,
  fixedWidthGutter: true,
  // theme: 'path to a theme e.g "ace/theme/textmate"',
  firstLineNumber: 1,
  overwrite: false,
  newLineMode: 'auto',
  useWorker: false,
  useSoftTabs: false,
  tabSize: 4,
  wrap: false, // boolean|number
  foldStyle: 'markbegin', // "markbegin"|"markbeginend"|"manual"
  // mode: path to a mode e.g "ace/mode/text",
});
