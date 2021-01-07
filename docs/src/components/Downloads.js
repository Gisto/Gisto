import React, { Component } from 'react';

function getFileType(file) {
  return file.split('.').reverse()[0];
}

function getOsType(file) {
  const fileExtension = getFileType(file);

  switch (fileExtension) {
    case 'snap':
    case 'AppImage':
    case 'deb':
    case 'rpm':
    case 'pacman': {
      return 'linux';
    }

    case 'dmg':
    case 'zip': {
      return 'mac';
    }

    case 'exe': {
      return 'windows';
    }

    default:
      return 'unknown';
  }
}

function formateDate(date) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const published = new Date(date);

  return published.toLocaleDateString('en-US', options);
}

function dataStructure(asset) {
  return {
    os: getOsType(asset.name),
    link: asset.browser_download_url,
    fileType: getFileType(asset.name)
  };
}

class Downloads extends Component {
  state = {
    publishedAt: null,
    latestVersion: null,
    downloads: null
  };

  componentDidMount() {
    if (!sessionStorage.getItem('gistoReleases')) {
      fetch('https://api.github.com/repos/Gisto/Gisto/releases/latest')
        .then((response) => response.json())
        .then((data) => {
          sessionStorage.setItem('gistoReleases', JSON.stringify(data));
          const latest = data;
          const downloads = latest.assets
            .map((asset) => {
              return dataStructure(asset);
            })
            .filter((os) => {
              return os !== 'unknown';
            });

          this.setState({
            publishedAt: formateDate(latest.published_at),
            latestVersion: `v${latest.name}`,
            downloads
          });
        });
    } else {
      const latest = JSON.parse(sessionStorage.getItem('gistoReleases'));
      const downloads = latest.assets
        .map((asset) => {
          return dataStructure(asset);
        })
        .filter((os) => {
          return os !== 'unknown';
        });

      this.setState({
        publishedAt: formateDate(latest.published_at),
        latestVersion: `v${latest.name}`,
        downloads
      });
    }
  }

  getDownloadText = (os, download) => os === 'windows' && download.link.match(/Portable\.exe/) ? 'portable' : download.fileType;

  renderDownloads = (os) => {
    return (
      this.state.downloads
      && this.state.downloads.reduce((acc, download) => {
        if (download.os === os) {
          acc.push(
            <a key={ download.fileType } href={ download.link }>
              <b>{this.getDownloadText(os, download)}</b>
            </a>
          );
        }

        return acc;
      }, [])
    );
  };

  render() {
    return (
      <section className="whiter boxes inner">
        <div className="w-container">
          <p className="txt-grey txt-center">
            <b>LATEST VERSION:</b>
            &nbsp;
            <span className="latest-release-version">{this.state.latestVersion}</span> |
            <a
              href="https://github.com/Gisto/Gisto/blob/master/CHANGELOG.md"
              className="txt-red txt-underline">
              Change log
            </a>
            | <b>RELEASED:</b> <span className="published_at">{this.state.publishedAt}</span>
          </p>
          <br />

          <div className="w-container">
            <div className="w-row">
              <div className="download w-col w-col-3 w-clearfix txt-center">
                <p className="txt-center">
                  <i className="fa fa-windows fa-4x" />
                </p>

                <h3>
                  <b>Windows</b>
                  <br />
                  Download
                </h3>
                <span>{this.renderDownloads('windows')}</span>
              </div>

              <div className="download w-col w-col-3 w-clearfix txt-center">
                <p className="txt-center">
                  <i className="fa fa-apple fa-4x" />
                </p>

                <h3>
                  <b>macOS</b>
                  <br />
                  Download
                </h3>
                <span>{this.renderDownloads('mac')}</span>
              </div>

              <div className="download w-col w-col-3 w-clearfix txt-center">
                <p className="txt-center">
                  <i className="fa fa-linux fa-4x" />
                </p>

                <h3>
                  <b>Linux</b>
                  <br />
                  Download
                </h3>
                <span>
                  {this.renderDownloads('linux')}
                </span>
              </div>

              <div className="download w-col w-col-3 w-clearfix txt-center">
                <p className="txt-center">
                  <i className="fa fa-cogs fa-4x" />
                </p>

                <h3>
                  Latest
                  <br /> <b>from Github</b>
                </h3>
                <a href="https://github.com/Gisto/Gisto/releases">GitHub releases</a>
              </div>
            </div>

            <div className="w-container">
              <div className="w-row">
                <div className="w-col w-col-pull-1 w-col-push-3 w-col-6 ">
                  <h2>Other install options:</h2>

                  <div>
                    <p>
                      via <b>Homebrew cask</b> (MacOS):
                    </p>

                    <pre>
                      <span>SHELL</span>$ brew install --cask gisto
                    </pre>
                    <small>Please note that it might be slightly outdated version</small>
                    <br />
                    <br />
                  </div>

                  <div>
                    <p>
                      via <b>snapcraft</b> (Linux):
                    </p>

                    <pre>
                      <span>SHELL</span>$ sudo snap install gisto
                    </pre>
                    <small>
                      Install Gisto on your Linux distribution:{' '}
                      <a href="https://snapcraft.io/gisto">https://snapcraft.io/gisto</a>
                    </small>
                    <br />
                    <br />
                  </div>

                  <div>
                    <p>
                      via <b>AUR</b> (ArchLinux):
                    </p>

                    <pre>
                      <span>SHELL (using yay)</span>$ yay -S gisto
                    </pre>
                    <pre>
                      <span>SHELL (using pakku)</span>$ pakku -S gisto
                    </pre>
                    <pre>
                      <span>SHELL (using trizen)</span>$ trizen -S gisto
                    </pre>

                    <small>Please note that it might be slightly outdated version</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-row">
              <p className="txt-grey txt-center">
                <b>PREVIOUS VERSION:</b> 0.3.2
              </p>
              <br />
              <div className="w-col w-col-12 w-clearfix txt-center">
                <p>
                  Development of this version is stopped at &quote;v0.3.2&quote; and it should be
                  considered obsolete. No updates, features or bugfixes will be issued.
                </p>
              </div>
              <div className="download w-col w-col-12 w-clearfix txt-center">
                <a href="https://github.com/Gisto/Gisto/releases/download/0.3.2-beta/Gisto-v0.3.2-windows-x64.zip">
                  <i className="fa fa-windows" /> Windows
                </a>
                <a href="https://github.com/Gisto/Gisto/releases/download/0.3.2-beta/Gisto-v0.3.2-macos-x64.dmg">
                  <i className="fa fa-apple" /> MACOS
                </a>
                <a href="https://github.com/Gisto/Gisto/releases/download/0.3.2-beta/Gisto-v0.3.2-linux-win32.zip">
                  <i className="fa fa-linux" /> Linux 32bit
                </a>
                <a href="https://github.com/Gisto/Gisto/releases/download/0.3.2-beta/Gisto-v0.3.2-linux-x64.zip">
                  <i className="fa fa-linux" /> Linux 64bit
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Downloads;
