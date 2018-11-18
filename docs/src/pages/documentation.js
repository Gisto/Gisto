import React from 'react';
import { Helmet } from 'react-helmet';

import Header from 'components/header';
import Footer from 'components/footer';

import addNewSnippet from '../images/add-new-snippet.png';

const Docs = () => (
  <React.Fragment>
    <Helmet>
      <title>Documentation</title>
    </Helmet>
    <Header/>

    <h1>Documentation</h1>

    <section className="whiter boxes page-docs inner">


      <div className="w-container content-container">
        <div className="w-row">

          <div className="w-col w-col-3 w-clearfix side-container">
            <h2>NAV</h2>
            <nav>
              <ul>
                <li><a className="innsite" href="#tags">Tag gist</a></li>
                <li><a className="innsite" href="#proxy">Usage via proxy</a></li>
                <li><a className="innsite" href="#new-snippet">Add new snippet</a></li>
                <li><a className="innsite" href="#devs">For developers</a></li>
              </ul>
            </nav>
          </div>

          <div className="w-col w-col-9 w-clearfix main">

            <h2 id="tags">Tag gist</h2>

            <p>Every gist can be tagged by adding hash-tag to it's title.</p>

            <p>For example: You have a gist titled</p>
            <pre><span>TEXT</span>Simple html template</pre>
            <p>and you'd like to tag it with "template" and "html" tags. All you need to
              do, is to add these tags as
              hash-tags to the end of the title like so:
            </p>
            <pre><span>TEXT</span>Simple html template #html #template</pre>
            <p>Gisto will then use the hash-tags to display tags in the gist list and
              search by this tags.
            </p>

            <h2 id="proxy">Usage via proxy</h2>

            <p>To run Gisto via proxy you'll have to start gisto with command line
              arguments:
            </p>

            <pre><span>SHELL</span>./Gisto-x.x.x.exe --args --proxy-server=proxyhost:port</pre>

            <h2 id="new-snippet">Add new snippet</h2>

            <p>
              To add new snippet, simply click the "+ New snippet" button on the top of the app.
            </p>

            <img src={ addNewSnippet }/>

            <h2 id="devs">Setting up for development</h2>

            <h4>Pre-installed requirements:</h4>
            <ul className="fa-ul">
              <li className="icons-li"><i className="fa fa-chevron-circle-right"/> <a
                href="http://git-scm.com/downloads">
                <strong>GIT</strong>
              </a>
                - distributed version control
              </li>
              <li className="icons-li"><i className="fa fa-chevron-circle-right"/> <a
                href="http://nodejs.org/"><strong>Node.js</strong> and <strong>npm</strong>
              </a> -
                server-side software system written in JavaScript
              </li>
            </ul>
            <h2>Set it all to work together:</h2>

            <p><i className="fa fa-chevron-circle-right"/> Clone the latest "next"
              branch: with the following command to a
              directory of your choice:
            </p>
            <pre><span>SHELL</span>git clone -b next --single-branch https://github.com/Gisto/Gisto.git</pre>

            <p><i className="fa fa-chevron-circle-right"/> Install dependencies in the
              directory created by cloning:
            </p>

            <pre><span>SHELL</span>npm install</pre>

            <p><i className="fa fa-chevron-circle-right"/> Run the local application
              (electron mode):
            </p>

            <pre><span>SHELL</span>npm run dev</pre>

            <p><i className="fa fa-chevron-circle-right"/> Run the local application
              (webapp):
            </p>

            <pre><span>SHELL</span>npm run start:web</pre>

            <i>(for more commands, check-out package.json's script section)</i>

            <h4><b>Congratulations!</b> If all went well, you are now have set-up local
              version of Gisto in your
              machine.
            </h4>

          </div>


        </div>
      </div>
    </section>

    <Footer/>
  </React.Fragment>
);

export default Docs;
