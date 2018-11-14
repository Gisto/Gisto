import React from 'react';
import { Helmet } from 'react-helmet';
import Header from 'components/header';
import Footer from 'components/footer';

import searchImg from 'images/search.png';
import taggingImage from 'images/tagging.png';
import optionsImage from 'images/options.png';
import enterpriseImage from 'images/regular-and-enterprise-login.png';
import dashboardImage from 'images/dashboard.png';
import webImage from 'images/web.png';
import revisionsImage from 'images/revisions.png';
import dragAnsDropImage from 'images/drag.png';
import themeImage from 'images/themes.png';
import colorsImage from 'images/colours.png';
import editorImage from 'images/monaco.png';
import keyBoardImage from 'images/QWERTY_keyboard.jpg';
import Logo from '../components/Logo';

const Features = () => (
  <React.Fragment>
    <Helmet>
      <title>Features</title>
    </Helmet>
    <Header/>

    <h1>Features</h1>

    <section className="whiter boxes">


      <div className="w-container main content-container">


        <div className="w-row">

          <div className="w-col w-col-4 w-clearfix feat">
            <img src={ searchImg } alt="Search"/>

            <h3>Search</h3>

            <p>
                            Gists can be found quickly using our search and can be filtered by gist
                            description, file
                            names, tags and more.
            </p>
          </div>

          <div className="w-col w-col-4 w-clearfix feat">
            <img alt="Tagging" src={ taggingImage }/>

            <h3>Gist tagging</h3>

            <p>
                            <Logo/> allows you to tag Gists with custom tags to help you find your
                            Gists
                            easily.
            </p>
          </div>

          <div className="w-col w-col-4 w-clearfix feat">
            <img alt="Options" src={ optionsImage }/>

            <h3>Quick actions</h3>

            <p>
                            <Logo/> allows you to quickly download,copy and view your Gists on GitHub,
                            in addition you
                            can also generate embed links or view your Gists on plunkr, jsbin or
                            jsfiddle.
            </p>
          </div>

        </div>


        <div className="w-row">


          <div className="w-col w-col-4 w-clearfix feat">
            <img alt="regular and enterprise login" src={ enterpriseImage }/>

            <h3>Enterprise mode</h3>

            <p>Enterprise mode in <Logo/> allows connecting to your GitHub enterprise
                            (on-premise) instead of public
                            github
            </p>
          </div>

          <div className="w-col w-col-4 w-clearfix feat">
            <img src={ dashboardImage } alt="Dashboard"/>

            <h3>Dashboard</h3>

            <p>
                            Feature rich, informative dashboard will show active, private, starred
                            and
                            untitled snippets count.
                            List tags, languages and starred snippets with quick search.
            </p>
          </div>

          <div className="w-col w-col-4 w-clearfix feat">
            <img src={ webImage } alt="Web app"/>

            <h3>Web app</h3>

            <p>Since version <b>v1.9.84</b>, <Logo/> available as a full featured web app.
                            You can navigate your browser to
              <a href="https://web.gistoapp.com">web.gistoapp.com</a> to access web
                            app.
            </p>
          </div>

        </div>


        <div className="w-row">

          <div className="w-col w-col-4 w-clearfix feat">
            <img src={ revisionsImage } alt="Revisions"/>

            <h3>Revision browser</h3>

            <p>
                            The revision browser enables you to see all previous changes to the gist
                            as well as change
                            statistics and
                            viewing the revision as it were at that time
            </p>
          </div>

          <div className="w-col w-col-4 w-clearfix feat">
            <img src={ dragAnsDropImage } alt="Drag and drop"/>

            <h3>Drag &amp; Drop</h3>

            <p><Logo/> supports drag and drop support for your files, you can drop files
                            or
                            directories into existing
                            or new gists alike
                            to add new files to gists
            </p>
          </div>

          <div className="w-col w-col-4 w-clearfix feat">
            <img src={ themeImage } alt="Themes"/>

            <h3>Color SWITCHING</h3>

            <p>You can chose app color via the settings menu. Any color can be used as a
                            base collor for <Logo/>
            </p>

          </div>

        </div>

        <div className="w-row">

          <div className="w-col w-col-4 w-clearfix feat">
            <img src={ colorsImage } alt="App color"/>

            <h3>Choose any color</h3>

            <p><Logo/> can be set to any color using system color selector from the
                            settings
                            menu
            </p>
          </div>

          <div className="w-col w-col-4 w-clearfix feat">
            <img src={ editorImage } alt="Editor"/>

            <h3>Rich editor</h3>

            <p><Logo/> includes open-source
              <a href="https://microsoft.github.io/monaco-editor/">monaco editor</a>.
                            A rich code editor for editing your Gists and includes
                            features such as syntax highlighting auto-completion emmet and more.
            </p>
          </div>

          <div className="w-col w-col-4 w-clearfix feat">
            <img src={ keyBoardImage } alt="Keyboard shortcuts"/>

            <h3>Keyboard shortcuts</h3>

            <p><Logo/> also has a variety of keyboard shortcuts, just
                            press <code>?</code> to view them.
            </p>
          </div>

        </div>


      </div>

    </section>

    <Footer/>
  </React.Fragment>
);

export default Features;
