# \</Gisto\>

###### Snippets made awesome

| Light theme | Dark theme |
|:------|:------|
| ![Gisto](http://gistoapp.com/img/lite_theme.png "Gisto") | ![Gisto](http://gistoapp.com/img/dark_theme.png "Gisto") |


## About

Gisto is a Cross-platform snippets management desktop application that allows you and/or your team share code snippets fast and easily.

Based on GitHub Gists Infrastructure which means you can use all your existing snippets by connecting your GitHub account!

Gisto started as an attempt to fulfill the lack of a syntax highlighted and cloud synchronized code snippet solution. 

You may think of Gisto as Evernote for code.

#### Gisto is now available to [download](https://github.com/Gisto/Gisto#downloads) on: Windows, OSX and Linux

## Features

* GitHub integration
* Gist tagging
* Quick in-place editing
* Drag & drop to create gist/add file
* Search filter gists
* Clipboard support
* Revision browser
* Change gist public/private state
* UI Themes
* Copy to clipboard
* Fast share gist with another Gisto user
* Direct GitHub access
* 3 ways of authentication (basic, Two-Factor Authentication (2FA) and with oAuth2 token directly)
* Offline access to gists (Will be integrated into full release)

and [more](http://gistoapp.com/features/)...

## Privacy/authentication

Gisto authenticates to GitHub by using basic authentication over SSL and retrieving an oAuth2 token. Thus the need for your GitHub user and password.

Gisto <em>only saves</em> the oAuth2 token received after authenticating and <em>nothing else</em>.

If you would rather to supply your own access token without providing Gisto your login details you may manually create an access token from the account settings at GitHub and login using the generated token.

This token will be saved permanently until you log out.

## Status

Gisto is currently in it's Beta.

Please see the [change.log](http://gistoapp.com/changelog/) for more detailed info regarding new features, bug fixes and releases.

It is still under heavily development towards the full release. 
Various features will be left out from the alpha release.

## Made of

Gisto made using HTML5/CSS3 and:

* [Angular.js](http://angularjs.org/) 
* [Node.js](http://nodejs.org/)
* [node-webkit](https://github.com/rogerwang/node-webkit)

and...

* [Angular UI](http://angular-ui.github.io/)
* [jQuery](http://jquery.com/)
* [Ace editor](http://ajaxorg.github.io/ace/)
* [showdown](https://github.com/coreyti/showdown)
* [Font-Awesome](http://fortawesome.github.io/Font-Awesome/)

## Downloads

From website: [www.gistoapp.com](http://www.gistoapp.com)

P.S. If you *really want* - you can also package Gisto by yourself (see "Packaging instructions" bellow).

## Packaging instructions

Gisto depends on [node-webkit](https://github.com/rogerwang/node-webkit) project. Build instructions for your platform may be found on the projects [Wiki](https://github.com/rogerwang/node-webkit/wiki/How-to-package-and-distribute-your-apps#make-a-package).

## Issues, bug reporting and pull requests

Please feel free to add a bug / feature request / suggestions to the [issue tracker]( https://github.com/Gisto/Gisto/issues).

Pull requests are welcome as well.

## Documentation

See [Docs](http://www.gistoapp.com/docs/) section on gisto site.

## License

MIT https://github.com/Gisto/Gisto/blob/master/LICENSE

## Development

See [setting up for development](http://www.gistoapp.com/docs/#doc-dev) section of the docs.

## Contributors and mentions

|||||
| ------------- |:-------------|:-----|:-----|
| ![Maayan](http://www.gravatar.com/avatar/3a615b34ef2060face8fcd481c6377e1?s=50 "Maayan") | Maayan | [@MaayanGlikser](https://twitter.com/MaayanGlikser) | [www.glikm.com](http://www.glikm.com) |
| ![Sasha](http://www.gravatar.com/avatar/7ddad1a9a1c8de452badaf82b6c30c76?s=50 "Sasha") | Sasha | [@sanusart](https://twitter.com/sanusart) | [www.sanusart.com](http://sanusart.com) |

---
