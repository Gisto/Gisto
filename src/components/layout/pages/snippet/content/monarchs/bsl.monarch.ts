const bslLanguage = {
  keywords: [
    'Процедура',
    'Функция',
    'КонецПроцедуры',
    'КонецФункции',
    'Если',
    'Тогда',
    'Иначе',
    'Для',
    'Каждого',
    'Пока',
    'Возврат',
    'Перем',
    'Экспорт',
    'Попытка',
    'Исключение',
    'КонецПопытки',
    'ВызватьИсключение',
  ],
  operators: ['=', '<>', '<', '>', '<=', '>=', '+', '-', '*', '/', '%', 'НЕ', 'И', 'ИЛИ'],
  // eslint-disable-next-line no-useless-escape
  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  tokenizer: {
    root: [
      // keywords / identifiers
      [
        /[а-яА-Я_][а-яА-Я0-9_]*/,
        {
          cases: {
            '@keywords': 'keyword',
            '@default': 'identifier',
          },
        },
      ],

      // numbers
      [/\d+/, 'number'],

      // strings
      [/".*?"/, 'string'],

      // comments
      [/\/\/.*$/, 'comment'],
    ],
  },
};

export default bslLanguage;
