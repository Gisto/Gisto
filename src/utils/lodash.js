import { mapValues } from 'lodash/fp';

export const mapValuesWithKey = mapValues.convert({ cap: false });
