const { BrowserWindow, ipcMain } = require('electron');
const tokenRequest = require('superagent');

const options = {
  client_id: process.env.GISTO_GITHUB_CLIENT_ID,
  client_secret: process.env.GISTO_GITHUB_CLIENT_SECRET,
  scopes: ["user", "gist"]
};

async function requestGithubToken(options, code) {
  const res = await tokenRequest
    .post('https://github.com/login/oauth/access_token', {
      client_id: options.client_id,
      client_secret: options.client_secret,
      code: code,
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

  authWindow.webContents.openDevTools()

  const githubUrl = 'https://github.com/login/oauth/authorize?';
  const authUrl = githubUrl + 'client_id=' + options.client_id + '&scope=' + options.scopes;
  authWindow.loadURL(authUrl);
  authWindow.show();

  async function handleCallback (url) {
    const raw_code = /code=([^&]*)/.exec(url) || null;
    const code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
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
      alert('Oops! Something went wrong and we couldn\'t' +
        'log you in using Github. Please try again.');
    }
  }

  authWindow.webContents.on('will-navigate', function (event, url) {
    handleCallback(url);
  });

  authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
    handleCallback(newUrl);
  });

  authWindow.on('close', function() {
    authWindow = null;
  }, false);
});
