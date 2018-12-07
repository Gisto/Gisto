import { mapValues } from 'lodash/fp';
// @ts-ignore
export const mapValuesWithKey = mapValues.convert({ cap: false });
