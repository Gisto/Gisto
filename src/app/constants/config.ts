export const logoText = `</Gisto>`;
export const tagRegex = /#(\d*[A-Za-z_0-9]+\d*)/g;
export const defaultSnippetDescription = 'untitled';
export const minimumCharactersToTriggerSearch = 2;
export const gitHubTokenKeyInStorage = 'github-api-key';
export const gitHubEnterpriseDomainInStorage = 'github-enterprise-url';

export const defaultURL = `https://github.com`;
export const defaultAPIEndpointURL = `https://api.github.com`;
export const defaultGistURL = `https://gist.github.com`;

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
