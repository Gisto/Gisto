const { BrowserWindow, ipcMain } = require('electron');
const tokenRequest = require('superagent');

const options = {
  client_id: process.env.GISTO_GITHUB_CLIENT_ID,
  client_secret: process.env.GISTO_GITHUB_CLIENT_SECRET,
  scopes: ['user', 'gist']
};

async function requestGithubToken(ops, code) {
  const res = await tokenRequest
    .post('https://github.com/login/oauth/access_token', {
      client_id: ops.client_id,
      client_secret: ops.client_secret,
      code
    });

  return res.body.access_token;
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
    const code = (rawCode && rawCode.length > 1) ? rawCode[1] : null;
    const error = /\?error=(.+)$/.exec(url);

    if (code || error) {
      authWindow.destroy();
    }

    if (code) {
      const token = await requestGithubToken(options, code);

      if (token) {
        console.log('\x1b[37m\x1b[41m', 'token ', '\x1b[0m', token);
        event.sender.send('token', token);
      }
    } else if (error) {
      // eslint-disable-next-line no-alert
      alert('Oops! Something went wrong and we couldn\'t' +
        'log you in using Github. Please try again.');
    }
  }

  authWindow.webContents.on('will-navigate', (ev, url) => {
    handleCallback(url);
  });

  authWindow.webContents.on('did-get-redirect-request', (ev, oldUrl, newUrl) => {
    handleCallback(newUrl);
  });

  authWindow.on('close', () => {
    authWindow = null;
  }, false);
});
