# { Gisto } 

> Snippets made awesome

[![GitHub release](https://img.shields.io/github/release/Gisto/Gisto.svg?style=flat-square)](https://github.com/Gisto/Gisto/releases/latest)
[![GitHub tag (latest SemVer pre-release)](https://img.shields.io/github/tag-pre/Gisto/Gisto.svg?label=pre-release&style=flat-square)](https://github.com/Gisto/Gisto/releases)
[![GitHub license](https://img.shields.io/github/license/Gisto/Gisto.svg?style=flat-square)](https://github.com/Gisto/Gisto/blob/master/LICENSE)
![Codecov master](https://img.shields.io/codecov/c/github/gisto/gisto/master.svg?label=coverage%20(master)&style=flat-square)
![Codecov next](https://img.shields.io/codecov/c/github/gisto/gisto/next.svg?label=coverage%20(next)&style=flat-square)
[![Code Climate](https://img.shields.io/codeclimate/maintainability-percentage/Gisto/Gisto.svg?style=flat-square)](https://codeclimate.com/github/Gisto/Gisto)
[![OSX build](https://travis-badge-per-job.herokuapp.com/?repo=Gisto/Gisto&job=1&style=flat-square&label=OSX%20build)](https://travis-ci.org/Gisto/Gisto)
[![Linux build](https://travis-badge-per-job.herokuapp.com/?repo=Gisto/Gisto&job=2&style=flat-square&label=Linux%20build)](https://travis-ci.org/Gisto/Gisto)
[![AppVeyor branch](https://img.shields.io/appveyor/ci/sanusart/Gisto/next.svg?style=flat-square&label=Windows%20build&colorB=green)](https://ci.appveyor.com/project/sanusart/gisto)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
- [About](#about)
- [Getting gisto](#getting-gisto)
- [Future and Status](#future-and-status)
- [Screenshots](#screenshots)
- [Features](#features)
- [Gisto previous version](#gisto-previous-version)
- [Latest builds](#latest-builds)
- [Issues, bug reporting and pull requests](#issues-bug-reporting-and-pull-requests)
- [Privacy/authentication](#privacyauthentication)
- [How to help/contribute](#how-to-helpcontribute)
- [Development setup](#development-setup)
- [Run tests](#run-tests)
- [Release cycle](#release-cycle)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## About

Gisto is a code snippet manager that runs on GitHub Gists and adds additional features such as searching, tagging and sharing gists while including a rich code editor. 
All your data is stored on GitHub and you can access it from GitHub Gists at any time with changes carrying over to Gisto

## Getting gisto

- You can download Gisto for (macOS, Windows, Linux) desktop from [our website](https://www.gistoapp.com/) or from [releases](https://github.com/Gisto/Gisto/releases) tab

- Use featured Web based client available at: [https://web.gistoapp.com](https://web.gistoapp.com) 

## Future and Status

Current released version is always on the branch [master]([next](https://github.com/Gisto/Gisto/tree/master))

Gisto next version in the works can be tracked via [next](https://github.com/Gisto/Gisto/tree/next) branch

Please see [next](https://github.com/Gisto/Gisto/tree/next) branch for upcoming version currently in development.

change.log of current version for more detailed info regarding new features, bug fixes and releases.

[Changelog](https://github.com/Gisto/Gisto/blob/master/CHANGELOG.md)

## Screenshots

|                                   |                                   |                                   |
|--------------------------------------------|-----------------------------------------------|--------------------------------------------------|
| Dashboard                                  | Snippet view                                  | Snippet options                                  |
| ![Dashboard](https://imgur.com/Jx8Tc9s.png) | ![Snippet view](https://imgur.com/OwseykV.png) | ![Snippet options](https://imgur.com/yiEJRNt.png) |
| Edit mode                                  | Settings                                      | Create new                                       |
| ![Edit mode](https://imgur.com/JtUCsfI.png) | ![Settings](https://imgur.com/1yliYhR.png)     | ![Create new](https://imgur.com/aoW5V8E.png)      |
| CSV preview                                  | GeoJSON preview                                      | Images preview                                       |
| ![Edit mode](https://imgur.com/Aac48m9.png) | ![Settings](https://imgur.com/LW6SFg2.png)     | ![Create new](https://imgur.com/bXySAUt.png)      |

# FEATURES

* Advanced search
* Enterprise log-in
* Tags
* Syntax highlight
* Grouping by language
* Quick snippet actions
* Copy to clipboard
* Copy file contents to clipboard
* Open in external tools like plunkr, jsbin, carbon.now.sh, jsfiddle, etc.
* Editor settings
* Theme color changer
* Drag and drop to create files
* Comments
* [Web app](https://web.gistoapp.com)
* Open source

### Preview of:

* Markdown preview _(with emoji)_
* AsciiDoc preview
* CSV and TSV preview
* GeoJSON preview
* Images preview _(read only, pushed to gist by git)_
* PDF preview _(read only, pushed to gist by git)_
* Open API/Swagger preview

And more...

## Gisto previous version

Gisto v1 can be tracked via branch [v1](https://github.com/Gisto/Gisto/tree/v1)

This version considered obsolete and will not be updated

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

- **Token via CLI** - You can log-in with token by passing it to the executable as CLI argument (macOs example): `open /Applications/Gisto.app/ --args --token 123123` ([#183](https://github.com/Gisto/Gisto/issues/183))

Gisto only saves the oAuth2 token received after authenticating and nothing else.

This token will be saved permanently until you log out.

You can find out more at the [F.A.Q.](http://www.gistoapp.com/faq/) section

## How to help/contribute

- fix issues, pull request are very welcome
- write, improve docs
- write tests (we use jest)
- fix/contribute to Gisto's website (https://gistoapp.com)
- suggest features and improvements
- spread the word

## Development setup 

> Make sure you  have **nodejs** and **npm** installed in the development machine

Clone the latest "next" branch:

`git clone -b next --single-branch https://github.com/Gisto/Gisto.git`

Install dependencies in the directory created by cloning:

`npm install`

Run the local application (electron mode):

`npm run dev`

Run the local application (webapp):

`npm run start:web` (you will also have to run webserver from `/web/` directory)

_(for more commands, see `package.json` script section)_

## Run tests

`npm run test` or `npm t`

## Release cycle

#### pre-release (_beta_ from _next_ branch)

- make changes on `next` brnch **ONLY**
- commit (this will run lint and tests)
- **do not push**, run `npm run make:release:beta` - will commit new tag with `-beta.0` prefix and will also push

#### release

- make changes on `next` brnch **ONLY**
- commit (this will run lint and tests) and push
- **do not push**, run `npm run make:release` (for minor version), will update readme and changelog, add and commit new tag and will also push

## License

[**MIT**](https://github.com/Gisto/Gisto/blob/master/LICENSE)
