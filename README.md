# { Gisto } 

> Snippets made awesome

[![Current Gisto version](https://img.shields.io/badge/version-v1.9.82-blue.svg?colorB=3F84A8&style=flat-square)](https://github.com/Gisto/Gisto)
[![GitHub license](https://img.shields.io/github/license/Gisto/Gisto.svg?style=flat-square)](https://github.com/Gisto/Gisto/blob/master/LICENSE)
[![Coveralls github branch](https://img.shields.io/coveralls/github/Gisto/Gisto/next.svg?style=flat-square)](https://coveralls.io/github/Gisto/Gisto)
[![Code Climate](https://img.shields.io/codeclimate/maintainability-percentage/Gisto/Gisto.svg?style=flat-square)](https://codeclimate.com/github/Gisto/Gisto)
[![OSX build](https://travis-badge-per-job.herokuapp.com/?repo=Gisto/Gisto&job=1&style=flat-square&label=OSX%20build)](https://travis-ci.org/Gisto/Gisto)
[![Linux build](https://travis-badge-per-job.herokuapp.com/?repo=Gisto/Gisto&job=2&style=flat-square&label=Linux%20build)](https://travis-ci.org/Gisto/Gisto)
[![AppVeyor branch](https://img.shields.io/appveyor/ci/sanusart/Gisto/next.svg?style=flat-square&label=Windows%20build&colorB=green)](https://ci.appveyor.com/project/sanusart/gisto)


## About

Gisto is a code snippet manager that runs on GitHub Gists and adds additional features such as searching, tagging and sharing gists while including a rich code editor. 
All your data is stored on GitHub and you can access it from GitHub Gists at any time with changes carrying over to Gisto

## Future and Status

Current released version is always on the branch [master]([next](https://github.com/Gisto/Gisto/tree/master))

Gisto next version in the works can be tracked via [next](https://github.com/Gisto/Gisto/tree/next) branch

Please see [next](https://github.com/Gisto/Gisto/tree/next) branch for upcoming version currently in development.

change.log of current version for more detailed info regarding new features, bug fixes and releases.

[Changelog](https://github.com/Gisto/Gisto/blob/master/CHANGELOG.md)

## Screenshots

| Dashboard | Gist view |
|:------|:------|
| <img src="https://i.imgur.com/s4d0uHL.png" alt="Dashboard"/> | <img src="https://i.imgur.com/DCR1zTK.png" alt="Gist view"/> |

## Gisto previous version

Gisto v1 can be tracked via branch [v1](https://github.com/Gisto/Gisto/tree/v1)

This version concidered obsolete and will not be updated

## Latest builds

Latest builds in the [releases](https://github.com/Gisto/Gisto/releases) tab

## Issues, bug reporting and pull requests

Please feel free to add a bug / feature request / suggestions to the issue tracker.

**Pull requests are very welcome**

## Privacy/authentication

**Gisto authenticates to GitHub by using one of the following methods:**

- **Oauth2** - the default option on the log-in screen

- **Basic authentication** over SSL and retrieving an oAuth2 token. Thus the need for your GitHub user and password

- **Access token** - If you would rather to supply your own access token without providing Gisto your login details you may manually create an access token from the account settings at GitHub and login using the generated token 

Gisto only saves the oAuth2 token received after authenticating and nothing else.

This token will be saved permanently until you log out.

You can find out more at the [F.A.Q.](http://www.gistoapp.com/faq/) section

## How to contribute

- fix issues, pull request are very welcome
- write docs
- fix/contribute to Gisto's website (https://gistoapp.com)
- suggest features and improvements
- spread the word

## Development setup 

> Make sure you  have **nodejs** and **npm** installed in the development machine

Clone the latest "next" branch:

`git clone -b next --single-branch https://github.com/Gisto/Gisto.git`

Install dependencies in the directory created by cloning:

`npm install`

Run the local application:

`npm run dev`

_(for more commands, see `package.json` script section)_

## Release cycle

- make changes
- commit (this will run lint and tests)
- run `npm run release` (for patch version) or `npm run release:minor` (for minor version), will update readme and changelog, add and commit new tag and will also push

## License

[**MIT**](https://github.com/Gisto/Gisto/blob/master/LICENSE)
