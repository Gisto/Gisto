# www.gistoapp.com

Web pages of [www.gistoapp.com](http://www.gistoapp.com)

**NOTE!** Default branch is `src`, deployment branch is `master`

### Built with:

 - [GatsbyJs](https://www.gatsbyjs.org/)_

### Running:

- `npm install` - to install dependencies (runs `bower install` via postinstall script)
- `npm run start` - to run the site

### Deploy

- `npm run build` - generate `public` dir
- Commit and push changes (to `src` branch)
- `npm run site-deploy` - will deploy content of generated `_site` with git subtree 
