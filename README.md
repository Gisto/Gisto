# GISTO — for gists #

## How to use API

API Methods:

* /auth/user/pass
* /gists 
* /gists/starred
* /gists/id
* /gists/star/id
* /gists/unstar/id
* /gists/comments/id

## post methods
* /gists/create

>parameters:

`description - type(string) - description of the gist`

`files - type(json string) - Json array with files and content { "text.txt": {content: "bla bla"} }`

* /gists/edit

>parameters:

`description - type(string) - new description of the gist`

`files - type(json string) - Json array with files and content { "text.txt": {content: "bla bla edited"} }`

### Running the API server

1. browse to the api directory
2. node server
3. navigate your browser to `http://localhost:3000/auth/user/pass` when user and pass are your github credentials to authenticate.
4. navigate to any of the urls specified by the API methods

#### Change log

[2013-03-26]
* Created very basic app design (to see: http://localhost/gisto/app/#/view1)

