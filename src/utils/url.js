import { DEFAULT_API_ENDPOINT_URL, defaultGistURL } from 'constants/config';
import { isEnterpriseLogin, getEnterpriseDomain } from 'utils/login';

export const getApiUrl = (sufix) => {
  return isEnterpriseLogin() ? `${getEnterpriseDomain()}${sufix}` : DEFAULT_API_ENDPOINT_URL;
};

export const getSnippetUrl = (sufix) => {
  return isEnterpriseLogin() ? `${getEnterpriseDomain()}${sufix}` : defaultGistURL;
};
