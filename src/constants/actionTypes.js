import { createAsyncAction } from 'utils/actions';

export const GET_RATE_LIMIT = createAsyncAction('GET_RATE_LIMIT');

export const LOGOUT = 'LOGOUT';
export const LOGIN_BASIC = createAsyncAction('LOGIN_BASIC');
export const LOGIN_WITH_TOKEN = createAsyncAction('LOGIN_WITH_TOKEN');
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
export const DELETE_TEMP_FILE = 'DELETE_TEMP_FILE';
export const ADD_TEMP_FILE = 'ADD_TEMP_FILE';
export const GET_SNIPPET_COMMENTS = createAsyncAction('GET_SNIPPET_COMMENTS');
export const CREATE_SNIPPET_COMMENT = createAsyncAction('CREATE_SNIPPET_COMMENT');
export const DELETE_COMMENT = createAsyncAction('DELETE_COMMENT');
export const TOGGLE_SNIPPET_COMMENTS = 'TOGGLE_SNIPPET_COMMENTS';
export const TOGGLE_FILE_COLLAPSE = 'TOGGLE_FILE_COLLAPSE';

export const GET_EMOJI = createAsyncAction('GET_EMOJI');

export const FILTER_SNIPPETS_BY_TEXT = 'FILTER_SNIPPETS_BY_TEXT';
export const FILTER_SNIPPETS_BY_TAGS = 'FILTER_SNIPPETS_BY_TAGS';
export const FILTER_SNIPPETS_BY_LANGUAGE = 'FILTER_SNIPPETS_BY_LANGUAGE';
export const FILTER_SNIPPETS_BY_STATUS = 'FILTER_SNIPPETS_BY_STATUS';
export const FILTER_SNIPPETS_BY_TRUNCATED = 'FILTER_SNIPPETS_BY_TRUNCATED';
export const FILTER_SNIPPETS_BY_UNTAGGED = 'FILTER_SNIPPETS_BY_UNTAGGED';
export const CLEAR_FILTERS = 'CLEAR_FILTERS';
export const REMOVE_TAG_FROM_FILTER = 'REMOVE_TAG_FROM_FILTER';

export const CHANGE_SETTINGS = 'CHANGE_SETTINGS';
