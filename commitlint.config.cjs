const config = require('@commitlint/config-conventional');
const types = config.rules['type-enum'][2];

config.rules['type-enum'][2] = ['typo', 'i18n'].concat(types);

module.exports = config;
