# <&#47;Gisto> commit guideline

Based on: [angular commit messages document  &raquo;](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit?pli=1)

## Format of the commit message

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

>Any line of the commit message cannot be longer 100 characters! This allows the message to be easier to read on github as well as in various git tools.

#### Allowed `<type>`

 * **FEATURE** (feature)
 * **FIX** (bug fix)
 * **DOCS** (documentation)
 * **STYLE** (formatting, missing semi-colons, etc.)
 * **UI** (CSS, UI improvements, etc.)
 * **TEST** (when creating tests)
 * **CLEANUP** (remove unnecessary code, files)
 * **IMPROVE** (improvement, e.g. enhanced feature)
 * **TOOLS** (build, tools changes etc.)

#### Allowed `<scope>`

Scope could be anything specifying place or element of the commit change(s).

#### Allowed `<subject>` text

 * use imperative, present tense: _change_ not _changed_ nor _changes_ or _changing_
 * do not capitalize first letter
 * do not append dot (.) at the end

> Subject line contains description of the change.

#### Allowed Message `<body>`

 * just as in <subject> use imperative, present tense: _change_ not _changed_ nor _changes_ or _changing_
 * include motivation for the change and contrast it with previous behavior
 * if commit is list use dash (-) to list items in a separate line

### Message Footer

#### Breaking changes

All breaking changes have to be mentioned in footer with the description of the change, justification and migration notes

```
BREAKING CHANGE: Id editing feature temporarily removed
    As a work around, change the id in XML using replace all or friends
```
#### Referencing issues

Closed bugs / feature requests / issues should be listed on a separate line in the footer prefixed with "Closes" keyword like this:
 
    Closes #234

or in case of multiple issues:
 
    Closes #123, #245, #992
    
### Good commit message examples:

```
STYLE (notifications): change notifications

cnahge warning notification colors:
- error notifications are now red
- warning and info notifications are now dark-yellow
```

or

```
FEATURE (editor): add emmet plug-in to editor

- add emmet plug-in to editor
- add emmet plug-in settings

Closes #351
CHANGES: plug-in settings and tweaks can be done from `settings` area
```
