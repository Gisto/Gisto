0.2.2b
-----------------
* Add ability to go to revision file on web.
* Fixed #66 - As suggested by juristr - user should be able to disable animations. Currently affects fade animation of the Gist section and animation of the list (on the left) while searching.
* Allow to change "public" or "secret" state of existing gist #38
* Add revisions browser options, fixes #53
* Implement post comments with preview and markdown. Fixes #31
* Fix outside links to work via custom directive.
* Optimized AppSettings service performance
* Fixed #65 where notifications do not clear when switching user on a single session.
* Fix tootlbox on small screens/resized window. Fixes #34
* Merge pull request #59 from tusharmath/master

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
