import { getSetting } from 'utils/settings';

export const logoText = '{ Gisto }';
export const TAG_REGEX = /#(\d*[A-Za-z_0-9]+\d*)/g;
export const DEFAULT_SNIPPET_DESCRIPTION = 'untitled';
export const MINIMUM_CHARACTERS_TO_TRIGGER_SEARCH = 2;
export const gitHubTokenKeyInStorage = 'github-api-key';
export const gitHubEnterpriseDomainInStorage = 'github-enterprise-url';

export const defaultURL = 'https://github.com';
export const DEFAULT_API_ENDPOINT_URL = 'https://api.github.com';
export const defaultGistURL = 'https://gist.github.com';

export const gateKeeperURL = 'https://gisto-gatekeeper.azurewebsites.net/authenticate';

export const SIDEBAR_WIDTH = 350;

export const SNIPPET_CACHE_SECONDS_DELAY = getSetting('snippet-fetch-cache-in-seconds') || 100;
