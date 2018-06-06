import { createAsyncAction } from 'utils/actions';

export const GET_SNIPPETS = createAsyncAction('GET_SNIPPETS');
export const GET_SNIPPET = createAsyncAction('GET_SNIPPET');
export const GET_STARRED_SNIPPETS = createAsyncAction('GET_STARRED_SNIPPETS');
export const GET_USER = createAsyncAction('GET_USER');

export const FILTER_SNIPPETS_BY_TEXT = 'FILTER_SNIPPETS_BY_TEXT';
export const FILTER_SNIPPETS_BY_TAGS = 'FILTER_SNIPPETS_BY_TAGS';
export const FILTER_SNIPPETS_BY_LANGUAGE = 'FILTER_SNIPPETS_BY_LANGUAGE';
export const CLEAR_FILTERS = 'CLEAR_FILTERS';
export const REMOVE_TAG_FROM_FILTER = 'REMOVE_TAG_FROM_FILTER';
