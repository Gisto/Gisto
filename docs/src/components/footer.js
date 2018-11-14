import React from 'react';
import PropTypes from 'prop-types';
import { graphql, StaticQuery } from 'gatsby';

import Logo from './Logo';

const Footer = ({ data }) => (
  <React.Fragment>
    <div className="push"/>
    <footer>

      <div className="w-container">
        <div className="w-row">

          {data.site.siteMetadata.contributors.map((contributor) => (
            <React.Fragment key={ contributor.name }>
              <div className="w-col w-col-1 w-clearfix">
                <img src={ contributor.gravatar } alt={ contributor.name }/>
              </div>
              <div className="w-col w-col-5 w-clearfix">
                <h3>{contributor.name}</h3>

                <p>
                  <a href={ contributor.site }>
                    { contributor.site.replace('https://', '') }
                  </a> |&nbsp;
                  <a href={ `https://twitter.com/${contributor.twitter_name}` }>
                    <i className="fa fa-twitter"/>
                  </a> |&nbsp;
                  <a href={ `https://github.com/${contributor.github_name}` }>
                    <i className="fa fa-github"/>
                  </a>
                </p>
              </div>
            </React.Fragment>
          ))}

        </div>
      </div>

      <p className="txt-center">&copy; {new Date().getFullYear()} <Logo/></p>

    </footer>

    <a href="#top" className="top innsite"><i className="fa fa-arrow-up"/></a>

  </React.Fragment>
);

Footer.propTypes = {
  data: PropTypes.object
};

export default (props) => (
  <StaticQuery
        query={ graphql`
        query FooterQuery {
          site {
            siteMetadata {
              contributors {
                  name
                  gravatar
                  site
                  twitter_name
                  github_name
                  description
              }
            }
          }
        }
      ` }

        render={ (data) => <Footer data={ data } { ...props }/> }/>
);
