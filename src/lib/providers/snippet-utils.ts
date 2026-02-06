export const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  json: 'application/json',
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
};

export const LANGUAGE_BY_EXTENSION: Record<string, string> = {
  js: 'JavaScript',
  mjs: 'JavaScript',
  cjs: 'JavaScript',
  ts: 'TypeScript',
  mts: 'TypeScript',
  cts: 'TypeScript',
  jsx: 'JSX',
  tsx: 'TSX',
  json: 'JSON',
  md: 'Markdown',
  markdown: 'Markdown',
  html: 'HTML',
  htm: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  less: 'Less',
  py: 'Python',
  rb: 'Ruby',
  go: 'Go',
  rs: 'Rust',
  php: 'PHP',
  java: 'Java',
  cpp: 'C++',
  cc: 'C++',
  cxx: 'C++',
  hpp: 'C++',
  c: 'C',
  h: 'C',
  sh: 'Shell',
  bash: 'Shell',
  zsh: 'Shell',
  yml: 'YAML',
  yaml: 'YAML',
  xml: 'XML',
  csv: 'CSV',
  pdf: 'PDF',
  tex: 'TeX',
  sql: 'SQL',
  swift: 'Swift',
  kt: 'Kotlin',
  kts: 'Kotlin',
  dart: 'Dart',
  lua: 'Lua',
  pl: 'Perl',
  pm: 'Perl',
  r: 'R',
  scala: 'Scala',
  hs: 'Haskell',
  ex: 'Elixir',
  exs: 'Elixir',
  erl: 'Erlang',
  hrl: 'Erlang',
  clj: 'Clojure',
  cljs: 'Clojure',
  cljc: 'Clojure',
  edn: 'Clojure',
  dockerfile: 'Dockerfile',
  makefile: 'Makefile',
  ini: 'INI',
  conf: 'INI',
  toml: 'TOML',
};

export function guessMimeType(extension: string): string {
  return MIME_BY_EXTENSION[extension] || 'text/plain';
}

export function guessLanguage(extension: string): string {
  return LANGUAGE_BY_EXTENSION[extension] || 'Text';
}

export function buildGitlabDescription(title: string, description: string): string {
  const safeTitle = title || '';
  const safeDescription = description || '';

  if (!safeDescription) {
    return safeTitle;
  }

  const titleClean = safeTitle.endsWith('...') ? safeTitle.slice(0, -3) : safeTitle;
  if (safeDescription.includes(titleClean)) {
    return safeDescription;
  }
  if (safeTitle.includes(safeDescription)) {
    return safeTitle;
  }

  return `${safeTitle}\n${safeDescription}`;
}
