0.3.0
-----------------
- FEATURE (gist polling): Add polling to update changed gists
- FEATURE (enterprise): Add GitHub Enterprise support
- FEATURE (enterprise): Add ability to use a custom notification server
- FEATURE (hotkeys): Add keyboard shortcuts, press ? to see available shortcuts
- FEATURE (toggle file content): You can now fold and unfold certain file in gists
- FEATURE (editor): Add option to wrap editor lines
- FEATURE (single gist): Add "Copy link to clipboard" for whole gist
- FEATURE (editor): Add .adoc and .asciidoc syntax highlighting
- IMPROVE (settings): Settings changes are now reflected immediately
- IMPROVE (version checking): Better version checking
- UI (settings): Change checkboxes to toggles in settings screen
- UI (settings): Add indication that settings were saved or imported.
- UI (theme): Fix input and select colors on dark themes
- UI (notifications): Add default avatar to Gisto share notifications
- UI (fonts): Fix default fonts in windows
- UI (revisions dialog): Fix Revisions popup UI location
- FIX (gists pagination): Fix gists pagination to pull all pages instead of stopping at 10 pages resulting in not all gists shown.
- FIX (editor) Ace Editor cursor wrongly placed when UI zoom is other than 100%
- FIX (API): Fix Delete not generating correct url
- FIX (gist list): Fix icons (star and private) not showing in gist list
- FIX (rename gist files): Prevent files from duplicating themselves when being renamed
- FIX (tags): Allow use of tags such as C# F#
- FIX (settings): Fix settings screen is not able to scroll down
- FIX (revisions): Fix revision history link
- FIX (shared gist view): Fix links to the gist when viewing a shared gist

0.2.6b
-----------------
- FEATURE (editor): add vim mode
- FIX (create gist): Fix text overflowing from the description field 
- FIX (single gist): wrong direct link for uppercase characters in filename or extension
- FIX (editor): paste now updates correctly in the angular file model
- FIX (edit mode): Edit mode is now canceled upon route change
- FIX (Open file in browser): Open file in browser is now opening correctly

0.2.5b
-----------------
- FEATURE (settings): add export/import of user settings
- FEATURE (settings): add export/import of user settings
- FEATURE (single gist): show fork info if gist is forked
- FEATURE (share gist): add auto-completion to share gist
- FEATURE (editor): add preview of markdown
- UI (big files): add indication of big file
- UI (css): add markdown css
- UI (css): update text fields to reflect valid/invalid state
- FIX (editor): fix font size settings issue
- FIX (dotfiles in gist): fix links of dotfiles
- FIX (gist API): gisto fail to handle files >1MB
- FIX (deleting a file): local copies of files now properly delete when not yet saved to GitHub
- FIX (drag & drop): drag area disappears on drag cancel
- FIX: Files that do not exist in github do not send a patch request upon deletion.
- FIX: Fix not being able to save when there is an empty file in create screen.
- FIX (single gist): notify upon Error when creating gist + validate filename with regex.
- FIX (single gist): URLs of gist API for single gist view.
- FIX (single gist): #81 where username was incorrectly pulled from json causing gist file url appear with no username parameter thus double slash.

0.2.4b
-----------------
- Fix: Editor overflow where pasted text would appear visually broken
- Fix: Better controll of editor size - line based
- Update: ACE editor with additions to 2 new themes and a few new highlighters
- Fix: When Cancelling a gist edit now the gist is returned to original state
- New: Emmet and status bar plugins to ace editor
- New: Drag & drop support for folders and sub-folders
- New: Auto completion to ace editor (enable from settings)
- New: Range selector to control application size in settings. Fixes #69
- New: Confirmation when deleting a file from a gist. Fixes #76.
- Update: Comments are now paginated due to changes in GitHub API.
            
0.2.3b
-----------------
- Fix: Fixed Fork gist bug
- Fix: Switch token generation to the new oAuth token generation per application
- New: Copy gist ID to clipboard
- Small UI/CSS fixes
- Repository maintains

0.2.2b
-----------------
- Fix: Text selection is now disabled on appropriate parts of the application, making a more streamlined native feel. Thanks to @tusharmath.
- New: You are now able to browse gists revisions and link to specific revisions of your gists.
- New: Allow to change the state of an existing gist from private to secret and vice versa.
- Fix: Dates meta on single gist toolbar now adopt more responsive design and should not break on small resolutions.
- New: You can now post and delete (your own) comments on gists within Gisto with markdown preview.
- Fix: Removing a gist after editing but not applying any changes now works.
- Fix: Notifications now clear when switching between users on a single session.
- New: Added the ability to disable animations. Thanks to @juristr
- New: Users without gravatar will now user the identicon generated by GitHub
- Fix: Optimized settings service layer performance and will now respond better to slower network connections.
- Fix: User preferences do not delete when a user logs out, all the application specific settings are kept.
- New: Added the ability to login with a manual oAuth2 token generated by GitHub Account settings for users that do not wish to user the current authentication system.

0.2.1b
-----------------
* Bugfix: edit mode now exits properly when logging out inside edit mode.
* Bugfix: Fixed bug with gists not saving properly when adding new files to gists at some cases.
* Modification: Changed discard notification icon to a trash can to better visualize the intent of the button.
* Feature: Added 2-factor-authentication (2FA) support to support new GitHub functionality.

0.2.0b
-----------------
* Gisto users can now share gists to each other easily! just hit the send button and enter a github username of the person you want to share with. The user will be immdiatly notified and can view/fork the gist!
* Open in plunker, You can now load gists with 1 click into plunker, if the gist contains web files (html, css, js) it automatically loads and runs them!
* Added more themes, syntax modes and new adjustable settings to the editor.
* Editors height are now based on file height and minimum and maximum height can be adjusted in the settings.
* Added "Edit Mode" for unobstructive file editing. when changes are detected to a file the sidebar closes allowing you to focus on the code.
* Added drop-down with file list in single gist view to ease navigation between files.
* Added "Copy embed code to clipboard".
* Added a delete button to files in create new gist screen.
* Added online/offline indicator to show status of notifications server.
* Bugfix: 404 bad requests.
* Added a check to see if a gist has comments, if there are none a request for the comments isn't sent.
* Gists are now saved only when changes are detected to prevent a revision increment with no changes.
* Added registration link to GitHub for those who do not yet have a GitHub account.
* Bugfix: positioning of data and revision data in single gist for low resolutions.
* Gist tags are now added to the list when creating a new gist.
* Gravatar not cached after user logout and another user logging in right after.
* Drag & Drop is now working in create gist.
* Added caching to github username and updated gravatar so it can appear in the main screen.
* See more at: http://www.gistoapp.com/changelog/

0.1.3a
-----------------
* Added indication to gist list for stared gists.
* Notify if empty file is to be saved.
* Add "Open file at GitHub Gist website" to gist files.
* Added animations for more aesthetic experience.
* Small UI fixes.
* Updated angular UI to angular-ui utils 0.0.3.
* Updated starred gists to update only when gists finished loading.
* Improved efficiency when loading multiple gist pages.

0.1.2a
-----------------
* Added version checker
* Rewrote the save function of application settings to be more versatile.
* Changed appearance  of main application screen.
* Changed notifications to bottom right corner in order to avoid movement of the entire screen.
* Updated node-webkit to version 0.6.0/Chromium 28

0.1.1a
------------------
* Edit mode is now triggered after dragging and dropping a file inside a gist.
* Deleting single files from gists is now available.
* Updates are now reflected on gist list

0.1.0a
------------------
* Initial version - Alpha release
