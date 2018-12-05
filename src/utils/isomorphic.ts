import { isElectron } from 'utils/electron';

export const isomorphicReload = () => {
  if (isElectron) {
    const { remote } = require('electron');

    remote.getCurrentWindow().reload();
  } else {
    window.location.reload();
  }
};

export const isomorphicHrefRedirect = (href: string) => {
  if (isElectron) {
    const { shell } = require('electron');

    shell.openExternal(href);
  } else {
    window.open(href, '_blank');
  }
};
