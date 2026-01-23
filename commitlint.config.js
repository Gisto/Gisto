import { RuleConfigSeverity } from '@commitlint/types';
import commitLint from '@commitlint/config-conventional';

const configuration = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      [...commitLint.rules['type-enum'][2], 'typo', 'i18n'],
    ],
  },
};

export default configuration;
