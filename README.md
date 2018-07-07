# { Gisto } 



> Snippets made awesome

[![Current Gisto version](https://img.shields.io/badge/dynamic/json.svg?query=$.version&uri=https://cdn.rawgit.com/Gisto/Gisto/next/package.json&label=version&colorB=3F84A8&style=flat-square)](https://github.com/Gisto/Gisto)
[![Coverage Status](https://coveralls.io/repos/github/Gisto/Gisto/badge.svg?branch=next)](https://coveralls.io/github/Gisto/Gisto?branch=next)
[![Maintainability](https://api.codeclimate.com/v1/badges/cec8aeea35cc30193cb6/maintainability)](https://codeclimate.com/github/Gisto/Gisto/maintainability)

![OSX build](https://travis-badge-per-job.herokuapp.com/?repo=Gisto/Gisto&job=1&style=flat-square&label=OSX%20build)
![Linux build](https://travis-badge-per-job.herokuapp.com/?repo=Gisto/Gisto&job=2&style=flat-square&label=Linux%20build)
[![AppVeyor](https://ci.appveyor.com/api/projects/status/tdogyqe0sa10iopb?svg=true&style=flat-square)](https://ci.appveyor.com/project/sanusart/gisto)

## About

Gisto is a code snippet manager that runs on GitHub Gists and adds additional features such as searching, tagging and sharing gists while including a rich code editor. 
All your data is stored on GitHub and you can access it from GitHub Gists at any time with changes carrying over to Gisto

## Future and Status

Current released copy is always on the branch [master]([next](https://github.com/Gisto/Gisto/tree/master))

Gisto next version is in the works, work can be tracked via [next](https://github.com/Gisto/Gisto/tree/next) branch

Please see [next](https://github.com/Gisto/Gisto/tree/next) branch for upcoming version currently in development.

change.log of current version for more detailed info regarding new features, bug fixes and releases.

## "Nightly" builds

"Nightly" builds triggered by commits.

[Downloads](https://gisto-releases.s3.amazonaws.com/index.html)

## Issues, bug reporting and pull requests

Please feel free to add a bug / feature request / suggestions to the issue tracker.

Please state that target is Gisto branch "**next**"

Pull requests are welcome as well.

## Privacy/authentication

**Gisto authenticates to GitHub by using one of the following methods:**

- **Oauth2** - the default option on the log-in screen

- **Basic authentication** over SSL and retrieving an oAuth2 token. Thus the need for your GitHub user and password

- **Access token** - If you would rather to supply your own access token without providing Gisto your login details you may manually create an access token from the account settings at GitHub and login using the generated token 

Gisto only saves the oAuth2 token received after authenticating and nothing else.

This token will be saved permanently until you log out.

You can find out more at the [F.A.Q.](http://www.gistoapp.com/faq/) section


## License

[**MIT**](https://github.com/Gisto/Gisto/blob/master/LICENSE)
