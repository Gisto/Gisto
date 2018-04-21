import { Injectable } from '@angular/core';
import { observable, action, computed } from 'mobx';
import {
  gitHubTokenKeyInStorage,
  defaultURL,
  defaultAPIEndpointURL,
  defaultGistURL,
  gitHubEnterpriseDomainInStorage
} from '../constants/config';

@Injectable()
export class SettingsStore {
  @observable color = '#ff0000';
  @observable defaultUrl = defaultURL;
  @observable apiUrl = defaultAPIEndpointURL;
  @observable gistUrl = defaultGistURL;
  @observable isEnterprise = false;
  @observable theme = 'vs';
  @observable animations = 'enabled';
  @observable auth2fa = false;

  @action setColor(value) {
    this.color = value;
  }

  @action setTheme(value) {
    this.theme = value;
  }

  @action setDefaultUrl(value = defaultURL) {
    localStorage.setItem(`${gitHubEnterpriseDomainInStorage}-default`, value);
    this.defaultUrl = value;
  }

  @action setApiUrl(value = defaultAPIEndpointURL) {
    localStorage.setItem(`${gitHubEnterpriseDomainInStorage}-api`, value);
    this.apiUrl = value;
  }

  @action setGistUrl(value = defaultGistURL) {
    localStorage.setItem(`${gitHubEnterpriseDomainInStorage}-gist`, value);
    this.gistUrl = value;
  }

  @computed get getDefaultUrl() {
    return localStorage.getItem(`${gitHubEnterpriseDomainInStorage}-default`) || this.defaultUrl;
  }

  @computed get getApiUrl() {
    return localStorage.getItem(`${gitHubEnterpriseDomainInStorage}-api`) || this.apiUrl;
  }

  @computed get getGistUrl() {
    return localStorage.getItem(`${gitHubEnterpriseDomainInStorage}-gist`) || this.gistUrl;
  }

  @computed get getTheme() {
    return this.theme;
  }

  @computed get isEnterpriseMode() {
    return this.isEnterprise = Boolean(this.apiUrl !== defaultAPIEndpointURL);
  }

  @computed get auth2faNeeded() {
    return this.auth2fa;
  }

  @computed get isLoggedIn() {
    return Boolean(localStorage.getItem(gitHubTokenKeyInStorage));
  }

  @action setAnimation(value) {
    this.animations = value;
  }

  @action setToken(token) {
    localStorage.setItem(gitHubTokenKeyInStorage, token);
  }

  @action logOut() {
    localStorage.setItem(gitHubTokenKeyInStorage, '');
    this.setDefaultUrl();
    this.setApiUrl();
    this.setGistUrl();
  }
}
