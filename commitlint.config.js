import config from '@commitlint/config-conventional';

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2, 'always', [
        ...(config.rules['type-enum']?.[2] || []), 
        'typo', 
        'i18n'
      ],
    ],
  },
};
