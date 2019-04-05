module.exports = {
  testURL: 'http://localhost/',
  modulePaths: [
    '/src',
    '<rootDir>'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/docs'
  ],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  setupFiles: [
    '<rootDir>/test/jest-setup.js',
    '<rootDir>/__mocks__/settings.js',
    '<rootDir>/__mocks__/electron.js',
    '<rootDir>/__mocks__/localStorage.js'
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
    'monaco-editor': '<rootDir>/node_modules/react-monaco-editor',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/assetsTransformer.js'
  },
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js}',
    '!src/electron/**',
    '!src/store/**',
    '!src/selectors/**',
    '!src/reducers/root.js',
    '!src/index.js',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/dist/**'
  ],
  coverageReporters: [
    'lcov'
  ]
};
