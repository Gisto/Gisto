# Gisto MK II

> Snippets made awesome

Gisto is a code snippet manager that runs on GitHub Gists and adds additional features such as searching, tagging and sharing gists while including a rich code editor.

> [!NOTE]
>
> Latest builds are always at the [releases](https://github.com/Gisto/Gisto/releases) tab or at [gisto.org](https:/gisto.org)

> [!IMPORTANT]  
> Current version is a complete rewrite of the original Gisto.

# Table of Contents

- [🍾 New version (2.x.x)](#-new-version-2xx)
- [👁️ Preview](#%EF%B8%8F-preview)
- [ℹ️ About](#ℹ%EF%B8%8F-about)
- [⬇️ Getting gisto](#️-getting-gisto)
- [⚠️ Important Notice About Installation](#️-important-notice-about-installation)
- [🌱 Features](#-features)
- [🔍 Privacy/authentication](#-privacyauthentication)
- [⚙️ Latest builds](#️-latest-builds)
- [🐞 Issues, bug reporting and pull requests](#-issues-bug-reporting-and-pull-requests)
- [👨‍💻 Development setup](#-development-setup)
- [🚀 Release cycle](#-release-cycle)
- [⚖️ License](#%EF%B8%8F-license)


# 🍾 New version (2.x.x)

> Tracked Via issue: [#387](https://github.com/Gisto/Gisto/issues/387)

> [changelog](https://github.com/Gisto/Gisto/blob/main/CHANGELOG.md)

All progress of current version can be tracked on the ["main"](https://github.com/Gisto/Gisto/tree/main) branch.
New version uses [Tauri](https://v2.tauri.app/) instead of electron - what significantly reduces the file size

## Previous version (up to 1.13.4)

Previous version can be tracked via the ["master"](https://github.com/Gisto/Gisto/tree/master) branch.

---

# 👁️ Preview

(click to play)

[![Gisto MK-II](https://github.com/user-attachments/assets/10815e14-7131-4ff1-bc63-108978653663)](https://www.youtube.com/watch?v=eJvADAZP2mg 'Gisto MK-II')

---

# ℹ️ About

Gisto is a code snippet manager that runs on GitHub Gists and adds additional features such as searching, tagging and sharing gists while including a rich code editor. All your data is stored on GitHub and you can access it from GitHub Gists at any time with changes carrying over to Gisto

---

# ⬇️ Getting gisto

You can download Gisto for (macOS, Windows, Linux) desktop from [releases](https://github.com/Gisto/Gisto/releases) tab

Or use full-featured Web based client available at: [Web app](https://app.gisto.org) (old one still [available](https://web-gistoapp.netlify.app) as well )

---

# ⚠️ Important Notice About Installation

### This App is Not Code-Signed

Since this is an open-source project and we currently do not have the resources to purchase code-signing certificates, the application **is not signed**. As a result:

- **On Windows**: You may see a warning like _"Windows protected your PC"_ or _"Unrecognized app."_
- **On macOS**: You may see a message saying _"This app is from an unidentified developer."_

These warnings are normal for unsigned applications and do not mean the app is harmful. However, always ensure you download the app from the **official release page of this repository** to avoid tampered files.

## How to Install the Unsigned App

### **Windows**:

1. When the warning appears, click **More info**.
2. Select **Run anyway** to proceed with the installation.

### **macOS**:

1. After downloading, if you see the warning, go to **System Preferences > Security & Privacy > General**.
2. Click **Open Anyway** next to the blocked app message.
3. Confirm by clicking **Open** when prompted.

---

# 🌱 Features

- Advanced search
- Enterprise log-in (under consideration)
- Tags
- Syntax highlight
- Grouping by language
- Quick snippet actions
- Copy to clipboard
- Copy file contents to clipboard
- Open in external tools like plunkr, carbon.now.sh, jsfiddle, etc.
- Editor settings
- Theme color changer
- [Web app](https://app.gisto.org)
- Open source

and more...

---

# 🔍 Privacy/authentication

Gisto authenticates to GitHub by using GitHub Access token

You may manually create an access token from the account settings at GitHub and login using the generated token.

Gisto only saves the Access token in your local storage and nothing else.

This token will be saved permanently until you log out, or it will expire.

---

# ⚙️ Latest builds

Latest builds are always at the [releases](https://github.com/Gisto/Gisto/releases) tab

---

# 🐞 Issues, bug reporting and pull requests

Please feel free to add a bug / feature request / suggestions to the issue tracker.

**Pull requests are very welcome**

---

# 👨‍💻 Development setup

> Make sure you have **nodejs** and **pnpm** (we use pnpm) installed in the development machine

### Setup

1. Clone the latest "main" branch: `git clone -b main --single-branch https://github.com/gisto/gisto.git`
2. Run `pnpm install`
3. Run `pnpm dev` to start the development app (vite)
4. Run `pnpm tauri dev` to start the development desktop app (vite with Tauri)

---

# 🚀 Release cycle

## on branch `main`:

- run `pnpm version major|minor|patch` - this will also create tag and generate changelog with commit
- run `git push origin head`

## on branch `release`:

merge `main` into `release`:

- run "`git merge main && git push origin head`

release.yml workflow of github actions is responsible for creating the release builds upon merging to special branch called `release`.

# ⚖️ License

Gisto is licensed under the MIT License. See [LICENSE](LICENSE) for the full license text.
