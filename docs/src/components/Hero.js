import React from 'react';
import { Link } from 'gatsby';
import Slider from './Slider';
import GithubButtonWithCount from './GithubButtonWithCount';
import Logo from './Logo';

const Hero = () => (
  <React.Fragment>
    <div className="w-container">
      <div className="w-row">
        <div className="w-col w-col-6 w-clearfix not-a-player">
          <p><Logo/> is a code snippet manager that runs on GitHub Gists and
          adds additional features
          such as searching, tagging and sharing gists while including a
          rich code editor.
          </p>
          <p>
          All your data is stored on GitHub and you can access it from
          GitHub Gists at any time
          with
          changes
          carrying over to <Logo/>.
          </p>
          <a href="https://github.com/Gisto/Gisto"
           className="btn bg-grey txt-white"><i
          className="fa fa-github"/>
          </a>
        &nbsp;
          <a href="https://twitter.com/gistoapp"
           className="btn bg-grey twitter txt-white"><i
          className="fa fa-twitter"/>
          </a>
        &nbsp;

          <a href="https://github.com/Gisto/Gisto/blob/master/CHANGELOG.md"
           className="btn bg-grey txt-white">Changelog <i
          className="fa fa-chevron-right"/>
          </a>
        </div>

        <div className="w-col w-col-6 w-clearfix app-image">
          <Slider/>
        </div>

      </div>
    </div>

    <section className="boxes">
      <div className="w-container">
        <div className="w-row">
          <Link to="features"
                className="w-col w-col-4 w-clearfix box bg-grey txt-white uppercase">
            <i className="fa fa-fire-extinguisher fa-4x pull-left"/>

            <h3>Features</h3>
            <span>
              <i>List of features and new additions</i> <i className="fa fa-chevron-right"/>
            </span>
          </Link>
          <a href="https://web.gistoapp.com"
             className="w-col w-col-4 w-clearfix box bg-greyer txt-white uppercase">
            <i className="fa fa-laptop fa-4x pull-left"/>

            <h3>Web client</h3>
            <span>
              <i>Full featured web client is now available</i> <i
              className="fa fa-chevron-right"/>
            </span>
          </a>
          <a href="#download"
             className="w-col w-col-4 w-clearfix box bg-tomato txt-white uppercase innsite">
            <i className="fa fa-download fa-4x pull-left"/>

            <h3>Downloads</h3>
            <span>
              <i>Mirrors, nightly builds and prev. versions</i> <i
              className="fa fa-chevron-right"/>
            </span>
          </a>
        </div>
      </div>
    </section>

    <div className="social w-clearfix">

      <GithubButtonWithCount repo="gisto" user="gisto" type="fork" count/>
      <GithubButtonWithCount repo="gisto" user="gisto" type="watch" count/>

    </div>

  </React.Fragment>
);

export default Hero;
