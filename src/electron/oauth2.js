const { BrowserWindow, ipcMain, session } = require('electron');
const tokenRequest = require('superagent');

const options = {
  client_id: process.env.GISTO_GITHUB_CLIENT_ID,
  scopes: ['gist']
};

async function requestGithubToken(ops, code) {
  const res = await tokenRequest.get(
    `https://gisto-gatekeeper.azurewebsites.net/authenticate/${code}`
  );

  return res.body.token;
}

ipcMain.on('oauth2-login', (event) => {
  let authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    'node-integration': false
  });

  const githubUrl = 'https://github.com/login/oauth/authorize?';
  const authUrl = `${githubUrl}client_id=${options.client_id}&scope=${options.scopes}`;

  authWindow.loadURL(authUrl);
  authWindow.show();

  async function handleCallback(url) {
    const rawCode = /code=([^&]*)/.exec(url) || null;
    const code = rawCode && rawCode.length > 1 ? rawCode[1] : null;
    const error = /\?error=(.+)$/.exec(url);

    if (code || error) {
      authWindow.destroy();
    }

    if (code) {
      const token = await requestGithubToken(options, code);

      if (token) {
        event.sender.send('token', token);
      }
    } else if (error) {
      // eslint-disable-next-line no-alert
      alert(
        `Oops! Something went wrong and we couldn't log you in using Github. Please try again.`
      );
    }
  }

  authWindow.webContents.on('will-navigate', (ev, url) => {
    handleCallback(url);
  });

  session.defaultSession.webRequest.onBeforeRedirect(
    { urls: ['*//web.gistoapp.com/?code=*'] },
    (details) => {
      handleCallback(details.redirectURL);
    }
  );

  authWindow.on(
    'close',
    () => {
      authWindow = null;
    },
    false
  );
});
