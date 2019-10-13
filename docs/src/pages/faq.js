import React from 'react';
import {Helmet} from "react-helmet";
import Header from 'components/header';
import Footer from 'components/footer';

const Faq = () => (
  <React.Fragment>
      <Helmet>
          <title>F.A.Q.</title>
      </Helmet>
    <Header/>

    <h1>F.A.Q.</h1>

    <section className="whiter boxes page-faq inner">

      <div className="w-container content-container">
        <div className="w-row">

          <div className="w-col w-col-3 w-clearfix side-container">

            <h2>QUESTIONS</h2>
            <nav>
              <ul>
                <li><a className="innsite" href="#what-is-gisto">What is Gisto?</a>
                </li>
                <li><a className="innsite" href="#auth">Authentication</a></li>
                <li><a className="innsite" href="#do-you-use-server">Do you use
                                    backend server?
                </a>
                </li>
                <li><a className="innsite" href="#who-can-see-my-gists">Who can see
                                    my
                                    gists?
                </a>
                </li>
                <li><a className="innsite" href="#run-as-portable">Use gisto as
                                    portable application in windows.
                </a>
                </li>
                <li><a className="innsite" href="#do-you-plan-to-add-feature">Do you
                                    plan to support / add support for
                                    [future-name-here]?
                </a>
                </li>
                <li><a className="innsite" href="#issues-bugs-features">Issues, bug
                                    reporting, pull and feature requests
                </a>
                </li>
                <li><a className="innsite" href="#how-to-contact">How to contact
                                    us
                </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="w-col w-col-9 w-clearfix">


            <h2 id="what-is-gisto">What is Gisto?</h2>

            <p>Gisto is a code snippet manager that runs on GitHub Gists and adds
                            additional features
                            such as searching, tagging and sharing gists while including a rich code
                            editor.
            </p>

            <p>Gisto is cross platform and is in constant sync with GitHub so you can
                            view
                            and edit
                            your Gists via both Gisto and GitHub.
            </p>


            <h2 id="auth">Authentication</h2>

            <p>Gisto authenticates to GitHub by using basic authentication over SSL and
                            retrieving an oAuth2 token
                            thus the need for your GitHub user and password.
            </p>

            <p>Gisto only saves the oAuth2 token received after authenticating and
                            nothing
                            else.
                            If you would rather to supply your own access token without providing
                            Gisto your login details you
                            may manually create an access token from the account settings at GitHub
                            and login using the
                            generated token.
            </p>

            <p>This token will be saved permanently until you log out.</p>

            <h2 id="do-you-use-server">Do you use backend server?</h2>

            <p>Gisto is using GitHub gist API and communicates directly with Github, no
                            3rd party server or database
                            involved in gist management.
            </p>

            <p>However we do use a backend server for "notifications and sharing
                            service",
                            the only data stored is username
                            and gist ID and this is to allow Gisto to notify user if there are Gists
                            shared with him.
            </p>

            <p>You also have the option of running your own notification server so you
                            can
                            be sure your data is secure.
            </p>

            <h2 id="who-can-see-my-gists">Who can see my Gists?</h2>

            <p>As per GitHub Guidelines Gists are not private and are available to the
                            public.
            </p>

            <p>The difference between secret and public Gists is that public Gists are
                            listed on GitHub website for
                            public viewing and searching while secret Gists are not
            </p>


            <h2 id="run-as-portable">Use gisto as portable application on windows?</h2>

            <blockquote>
              Please note this instructions refers to legacy version (up to v0.3.2)
            </blockquote>

            <p>For a non-installer version of Gisto, you can:</p>

            <ul className="fa-ul">
              <li className="icons-li"><i
                                className="fa fa-chevron-circle-right" /> Download a ZIP file of
                                Windows Version from Gisto "Nightly" builds: <a
                                    href="http://build.gistoapp.com">build.gistoapp.com
                                </a> and
                                extract it to some directory of your choosing.
              </li>
              <li className="icons-li"><i
                                className="fa fa-chevron-circle-right" /> Create a empty file in
                                directory you've extracted Gisto ZIP named <em>gisto.bat</em>
              </li>
              <li className="icons-li"><i
                                className="fa fa-chevron-circle-right" /> Edit <em>gisto.bat</em> file
                                and add the following content: <code>gisto.exe
                                    --data-path="./gistoData"
                                </code>
              </li>
              <li className="icons-li"><i
                                className="fa fa-chevron-circle-right" /> Start Gisto by
                                double-click the <em>gisto.bat</em> file.
              </li>
            </ul>

            <p>You have now your portable version of Gisto and all data will be saved in
                            directory named <em>gistoData</em>, relative to path where you are
                            running
                            Gisto from.
            </p>

            <p>In order to update portable Gisto - just download new version ZIP and
                            extract it by overwriting the existing files.
            </p>

            <h2 id="do-you-plan-to-add-feature">Do you plan to support / add support for
                            [<i>future-name-here</i>]?
            </h2>

            <p>Please open a feature request in our <a
                            href="https://github.com/Gisto/Gisto/issues">issue tracker
            </a>, we
                            appreciate and strive for
                            suggestions on how to improve Gisto.
            </p>

            <h2 id="issues-bugs-features">Issues, bug reporting, pull and feature
                            requests
            </h2>

            <p>Please feel free to add a bug / feature request / suggestions to the <a
                            href="https://github.com/Gisto/Gisto/issues">issue tracker
            </a>.
                            Pull requests are also very welcome as well.
            </p>

            <h2 id="how-to-contact">How to contact us</h2>

            <p>Twitter: <a href="https://twitter.com/gistoapp">@gistoapp</a></p>

            <p>Email: contact@gistoapp.com</p>

            <p>Issue tracker: <a href="https://github.com/Gisto/Gisto/issues">Issue
                            tracker at GitHub
            </a>
            </p>

          </div>

        </div>
      </div>

    </section>

    <Footer/>
  </React.Fragment>
);

export default Faq;
