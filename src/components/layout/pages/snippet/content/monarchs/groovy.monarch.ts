const groovyLanguage = {
  defaultToken: '',
  tokenPostfix: '.groovy',

  keywords: [
    'as',
    'assert',
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'def',
    'default',
    'do',
    'else',
    'enum',
    'extends',
    'false',
    'final',
    'finally',
    'for',
    'goto',
    'if',
    'implements',
    'import',
    'in',
    'instanceof',
    'interface',
    'new',
    'null',
    'package',
    'return',
    'static',
    'super',
    'switch',
    'this',
    'throw',
    'throws',
    'trait',
    'true',
    'try',
    'while',
    'var',
    'void',
    'private',
    'protected',
    'public',
    'abstract',
    'synchronized',
    'native',
    'strictfp',
    'transient',
    'volatile',
  ],

  operators: [
    '=',
    '>',
    '<',
    '!',
    '~',
    '?',
    ':',
    '==',
    '!=',
    '===',
    '!==',
    '<=',
    '>=',
    '&&',
    '||',
    '++',
    '--',
    '+',
    '-',
    '*',
    '/',
    '&',
    '|',
    '^',
    '%',
    '<<',
    '>>',
    '>>>',
    '+=',
    '-=',
    '*=',
    '/=',
    '&=',
    '|=',
    '^=',
    '%=',
    '<<=',
    '>>=',
    '>>>=',
  ],

  symbols: /[=><!~?:&|+\-*/^%]+/,

  escapes: /\\[abfnrtv\\"'0-9xuU]/,

  tokenizer: {
    root: [
      // Identifiers and keywords
      [
        /[a-zA-Z_$][\w$]*/,
        {
          cases: {
            '@keywords': 'keyword',
            '@default': 'identifier',
          },
        },
      ],

      // Whitespace
      { include: '@whitespace' },

      // Delimiters and operators
      [/[{}()[\]]/, '@brackets'],
      [
        /@symbols/,
        {
          cases: {
            '@operators': 'operator',
            '@default': '',
          },
        },
      ],

      // Numbers
      [/\d*\.\d+([eE][-+]?\d+)?[fFdD]?/, 'number.float'],
      [/0[xX][0-9a-fA-F]+/, 'number.hex'],
      [/\d+/, 'number'],

      // Strings
      [/'/, { token: 'string.single', next: '@singleQuotedString' }],
      [/"""/, { token: 'string.quote', next: '@tripleDoubleQuotedString' }],
      [/"/, { token: 'string.quote', next: '@doubleQuotedString' }],

      // Regex
      [/~\/[^/]*\//, 'regexp'],

      // Annotations
      [/@[a-zA-Z_]\w*/, 'annotation'],
    ],

    // Single-quoted strings
    singleQuotedString: [
      [/[^\\']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, { token: 'string.single', next: '@pop' }],
    ],

    // Double-quoted strings (GStrings)
    doubleQuotedString: [
      [/[^\\$"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/\$\{[^}]+}/, 'variable'],
      [/\$[a-zA-Z_]\w*/, 'variable'],
      [/"/, { token: 'string.quote', next: '@pop' }],
    ],

    // Triple-quoted strings (e.g., """multi-line""")
    tripleDoubleQuotedString: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"""/, { token: 'string.quote', next: '@pop' }],
      [/"/, 'string'],
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\*\*(?!\/)/, 'comment.doc', '@javadoc'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
    ],

    comment: [
      [/[^/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[/*]/, 'comment'],
    ],

    javadoc: [
      [/[^/*]+/, 'comment.doc'],
      [/\*\//, 'comment.doc', '@pop'],
      [/[/*]/, 'comment.doc'],
    ],
  },
};

export default groovyLanguage;
