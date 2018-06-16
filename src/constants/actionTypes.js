import { createAsyncAction } from 'utils/actions';

export const GET_RATE_LIMIT = createAsyncAction('GET_RATE_LIMIT');

export const LOGOUT = 'LOGOUT';
export const LOGIN_BASIC = createAsyncAction('LOGIN_BASIC');
export const LOGIN_BASIC_REQUEST_2FA = 'LOGIN_BASIC_REQUEST_2FA';

export const GET_SNIPPETS = createAsyncAction('GET_SNIPPETS');
export const GET_SNIPPET = createAsyncAction('GET_SNIPPET');
export const GET_STARRED_SNIPPETS = createAsyncAction('GET_STARRED_SNIPPETS');
export const GET_USER = createAsyncAction('GET_USER');
export const SET_STAR = createAsyncAction('SET_STAR');
export const UNSET_STAR = createAsyncAction('UNSET_STAR');
export const CREATE_SNIPPET = createAsyncAction('CREATE_SNIPPET');
export const DELETE_SNIPPET = createAsyncAction('DELETE_SNIPPET');
export const UPDATE_SNIPPET = createAsyncAction('UPDATE_SNIPPET');
export const START_EDIT_SNIPPET = 'START_EDIT_SNIPPET';
export const STOP_EDIT_SNIPPET = 'STOP_EDIT_SNIPPET';
export const UPDATE_TEMP_SNIPPET = 'UPDATE_TEMP_SNIPPET';

export const FILTER_SNIPPETS_BY_TEXT = 'FILTER_SNIPPETS_BY_TEXT';
export const FILTER_SNIPPETS_BY_TAGS = 'FILTER_SNIPPETS_BY_TAGS';
export const FILTER_SNIPPETS_BY_LANGUAGE = 'FILTER_SNIPPETS_BY_LANGUAGE';
export const CLEAR_FILTERS = 'CLEAR_FILTERS';
export const REMOVE_TAG_FROM_FILTER = 'REMOVE_TAG_FROM_FILTER';

