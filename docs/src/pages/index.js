import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'gatsby';

import Header from 'components/header';
import Footer from 'components/footer';
import Slider from 'components/Slider';

import 'styles/grid.css';
import 'font-awesome/css/font-awesome.min.css';
import 'styles/gisto.scss';


import editImg from 'images/edit.png';
import searchImg from 'images/search.png';
import taggingImg from 'images/tagging.png';
import Downloads from 'components/Downloads';
import Hero from '../components/Hero';
import About from '../components/About';
import Logo from '../components/Logo';

export default () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Gisto - Snippets Made Awesome</title>
      </Helmet>
      <Header/>

      <section className="home">

        <div className="under-nav">

          <h1>Snippets Made Awesome</h1>

          <Hero/>

          <h1>Features</h1>

        </div>

      </section>

      <section className="whiter boxes features-boxes">

        <div className="w-container">

          <div className="w-row">

            <div className="w-col w-col-4 w-clearfix feat">
              <img alt="Gisto" src={ editImg } alt="Edit"/>

              <h3>Rich Editor</h3>

              <p>
                <Logo/> includes open-source <a
                href="https://microsoft.github.io/monaco-editor/">monaco
                editor
                </a>.
                A rich code editor for editing your Gists and includes features such
                as syntax highlighting
                auto-completion emmet and more.
              </p>
            </div>

            <div className="w-col w-col-4 w-clearfix feat">
              <img src={ searchImg } alt="Edit"/>

              <h3>Search</h3>

              <p>
                Gists can be found quickly using our search and can be filtered by
                gist description, file
                names, tag or multiple tags, language and more.
              </p>
            </div>

            <div className="w-col w-col-4 w-clearfix feat">
              <img src={ taggingImg } alt="Edit"/>

              <h3>Tags</h3>

              <p>
                <Logo/> allows you to tag Gists with custom tags to help you find your
                Gists easily. Just add
                hashtag to snippet title and you done. Later gitsts can be found by
                typing hash-tag into
                search or from the tag list on the dashboard.
              </p>
            </div>

          </div>

          <div className="center-holder">
            <Link to="features" className="btn bg-grey txt-white btn-center">
              More features <i className="fa fa-chevron-right"/>
            </Link>
          </div>
        </div>
      </section>


      <h1 id="about">About <Logo/></h1>

      <section className="whiter boxes">

        <About/>

      </section>


      <h1 id="download">Downloads</h1>

      <Downloads/>

      <Footer/>
    </React.Fragment>
  );
};
