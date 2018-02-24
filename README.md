# \</Gisto\>

[![Join the chat at https://gitter.im/Gisto/Gisto](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Gisto/Gisto?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

###### Snippets made awesome

| Light theme | Dark theme |
|:------|:------|
| <img src="http://gistoapp.com/images/lite_theme.png" width="400px" alt="Gisto"> | <img src="http://gistoapp.com/images/dark_theme.png" width="400px" alt="Gisto"> |

# IMPORTANT

Due to [Github changes in TLS policies](https://githubengineering.com/crypto-deprecation-notice/) we issued a hotfix in a shape of runnable binaries for all platforms, Installers for all platform will be released through the regular channels soon after

## **NOTE! This are runnable binaries ~~installers~~. Installers for all platform will be released through the regular channels soon after **

### **macOS** [Download](https://github.com/Gisto/Gisto/releases) 
- Replace the file from `.zip` in `/Applications`

### **Windows** [Download](https://github.com/Gisto/Gisto/releases)
- Please uninstall previous Gisto version before use. 
- Use by extracting `.zip` to directory of your choice. 
- Run by executing `Gisto.exe` from the extracted directory.

### **Linux** [Download](https://github.com/Gisto/Gisto/releases)
- Please uninstall previous Gisto version before use. 
- Use by extracting `.zip` to the folder of your choice. 
- Run by executing `./gisto` from the extracted directory.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Privacy/authentication](#privacyauthentication)
- [Status](#status)
- [Made using](#made-using)
- [Download and install](#download-and-install)
- [Other install options](#other-install-options)
- ["Nightly" builds](#nightly-builds) [![Build Status](https://circleci.com/gh/sitecues/sitecues-core.svg?style=svg&circle-token=acc2259949dc35d324ffff96186e5874a4b1ef4f)](https://circleci.com/gh/Gisto/Gisto/tree/master)
- [Issues, bug reporting and pull requests](#issues-bug-reporting-and-pull-requests)
- [Documentation](#documentation)
- [License](#license)
- [Development](#development)
- [Contributors and mentions](#contributors-and-mentions)

## About

Gisto is a code snippet manager that runs on GitHub Gists and adds additional features such as searching, tagging and sharing gists while including a rich code editor. 
All your data is stored on GitHub and you can access it from GitHub Gists at any time with changes carrying over to Gisto

#### Gisto is now available to [download](https://github.com/Gisto/Gisto#downloads) on: Windows, OSX and Linux

## Features

* GitHub integration
* Gist tagging
* Quick in-place editing
* Drag & drop to create gist/add file
* Search gists
* Clipboard support
* Revision browser
* Change gist public/private state
* UI Themes
* Fast sharing gist with other Gisto users
* 3 ways of authentication (basic, Two-Factor Authentication (2FA) and with oAuth2 token directly)
* Offline access to gists (Will be integrated into full release)

and [more](http://gistoapp.com/features/)...

## Privacy/authentication

Gisto authenticates to GitHub by using basic authentication over SSL and retrieving an oAuth2 token. Thus the need for your GitHub user and password.

Gisto <em>only saves</em> the oAuth2 token received after authenticating and <em>nothing else</em>.

If you would rather to supply your own access token without providing Gisto your login details you may manually create an access token from the account settings at GitHub and login using the generated token.

This token will be saved permanently until you log out.

You can find out more at the [F.A.Q.](http://www.gistoapp.com/faq/) section

## Status

Please see the [change.log](http://www.gistoapp.com/changelog/) for more detailed info regarding new features, bug fixes and releases.

## Made using

Gisto is made using various open source projects such as

* [Angular.js](http://angularjs.org/) 
* [Node.js](http://nodejs.org/)
* [node-webkit](https://github.com/rogerwang/node-webkit)
* [Ace editor](http://ajaxorg.github.io/ace/)
* [Angular UI](http://angular-ui.github.io/)
* [jQuery](http://jquery.com/)
* [Font-Awesome](http://fortawesome.github.io/Font-Awesome/)

## Download and install

~~You can download Gisto at: [www.gistoapp.com](http://www.gistoapp.com)~~

[Download](https://github.com/Gisto/Gisto/releases)

#### Other install options

via **Homebrew cask**:

`$ brew cask install gisto`

via **Archlinux AUR**:

`$ yaourt -S gisto`

via **SlackBuilds.org (Slackware)**:

`# sbopkg -i gisto`

P.S. If you *really want* - you can also package Gisto by yourself (See [Docs](http://www.gistoapp.com/documentation/) section on Gisto site).

## "Nightly" builds

Gisto "nightly" builds are automatic builds triggered by commits to "master" branch

> Please note that these are not stable releases. Bugs are possible. Those builds lacks the usual installers you may get in the regular releases. 

"Nightly" builds for all platforms are avaliable at: [build.gistoapp.com](http://build.gistoapp.com/)

## Issues, bug reporting and pull requests

Please feel free to add a bug / feature request / suggestions to the [issue tracker]( https://github.com/Gisto/Gisto/issues).

Pull requests are welcome as well.

## Documentation

See [Docs](http://www.gistoapp.com/documentation/) section on Gisto site.

## License

MIT https://github.com/Gisto/Gisto/blob/master/LICENSE

## Development

See [setting up for development](http://www.gistoapp.com/documentation/#devs) section of the docs.

## Contributors and mentions

|||||
| ------------- |:-------------|:-----|:-----|
| ![Maayan](http://www.gravatar.com/avatar/3a615b34ef2060face8fcd481c6377e1?s=50 "Maayan") | Maayan | [@MaayanGlikser](https://twitter.com/MaayanGlikser) | [www.glikm.com](http://www.glikm.com) |
| ![Sasha](http://www.gravatar.com/avatar/7ddad1a9a1c8de452badaf82b6c30c76?s=50 "Sasha") | Sasha | [@sanusart](https://twitter.com/sanusart) | [www.sanusart.com](http://sanusart.com) |

[![Analytics](https://ga-beacon.appspot.com/UA-49967672-1/Gisto/README.md?pixel)](https://github.com/igrigorik/ga-beacon)

---
