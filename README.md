# Gisto MK II

> Snippets made awesome

Gisto is a code snippet manager that runs on GitHub Gists and adds additional features such as searching, tagging and sharing gists while including a rich code editor.

> [!NOTE]  
> Current version is a complete rewrite of the original Gisto. It is a work in progress and should not yet be considered for production use.
> 
 
## Current version (2.x.x)

All progress of current version can be tracked on the ["main"](https://github.com/Gisto/Gisto/tree/main) branch.

## Previous version (up to 1.13.4)

Previous version can be tracked via the ["master"](https://github.com/Gisto/Gisto/tree/master) branch.

# About

Gisto is a code snippet manager that runs on GitHub Gists and adds additional features such as searching, tagging and sharing gists while including a rich code editor. All your data is stored on GitHub and you can access it from GitHub Gists at any time with changes carrying over to Gisto

# Getting gisto

You can download Gisto for (macOS, Windows, Linux) desktop from [releases](https://github.com/Gisto/Gisto/releases) tab

Or use full featured Web based client available at: https://web-gistoapp.netlify.app

# Features

- Advanced search
- Enterprise log-in
- Tags
- Syntax highlight
- Grouping by language
- Quick snippet actions
- Copy to clipboard
- Copy file contents to clipboard
- Open in external tools like plunkr, jsbin, carbon.now.sh, jsfiddle, etc.
- Editor settings
- Theme color changer
- Drag and drop to create files
- Comments
- Web app
- Open source

and more...

# Privacy/authentication

Gisto authenticates to GitHub by using GitHub Access token

You may manually create an access token from the account settings at GitHub and login using the generated token.

Gisto only saves the Access token in your local storage and nothing else.

This token will be saved permanently until you log out, or it will expire.

# Latest builds

Latest builds are always at the [releases](https://github.com/Gisto/Gisto/releases) tab

# Issues, bug reporting and pull requests

Please feel free to add a bug / feature request / suggestions to the issue tracker.

**Pull requests are very welcome**

# Development setup

> Make sure you have **nodejs** and *pnpm* installed in the development machine


### Setup

1. Clone the latest "main" branch: `git clone -b main --single-branch https://github.com/gisto/gisto.git`
2. Run `pnpm install`
3. Run `pnpm dev` to start the development app (vite)
5. Run `pnpm tauri dev` to start the development desktop app (vite with Tauri)
4. Run `pnpm build` to build the app
5. Run `pnpm tauri build` to build the desktop app

# Release cycle

release.yml workflow of github actions is responsible for creating the release builds upon mergin to special branch called "release".


## License

Gisto is licensed under the MIT License. See [LICENSE](LICENSE) for the full license text.
