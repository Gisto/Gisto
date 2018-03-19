export const logoText = `</Gisto>`;
export const tagRegex = /#(\d*[A-Za-z_0-9]+\d*)/g;
export const defaultSnippetDescription = 'untitled';
export const defaultEndpointURL = `https://gist.github.com`;
export const minimumCharactersToTriggerSearch = 2;
export const gitHubTokenKeyInStorage = 'github-api-key';

export const editorConfig = (editMode = false) => ({
  fontSize: 13,
  readOnly: !editMode,
  contextmenu: editMode,
  cursorBlinking: 'blink',
  automaticLayout: false,
  fontFamily: 'monaco',
  fontLigatures: true,
  folding: true,
  scrollBeyondLastLine: false,
  renderLineHighlight: 'all',
  formatOnPaste: true,
  formatOnType: true
});
