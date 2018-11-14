import React, { Component } from 'react';
import Media from 'react-media';
import { graphql, Link, StaticQuery } from 'gatsby';
import Logo from './Logo';

class Header extends Component {
  state = {
    open: false
  };

  handleMenu = (open) => this.setState({ open });

  render() {
    const { data } = this.props;

    const menu = (
      <React.Fragment>
        {data.site.siteMetadata && data.site.siteMetadata.navigation.map((link) => (
          <span onClick={ () => this.handleMenu(false) }>
            <Link to={ link.path }
                key={ link.path }
                activeClassName="active"
                className="nav-link first current">
              {link.displayName}
            </Link>
          </span>
        ))}
      </React.Fragment>
    );


    return (
      <header className="section header">
        <div className="header">

          <Media query={ { maxWidth: 599 } }>
            {(matches) => matches ? (
              <React.Fragment>
                <div className="mobile-menu"
                       onClick={ () => this.handleMenu(this.state.open = !this.state.open) }>
                  <i className={ `fa ${this.state.open ? 'fa-times' : 'fa-bars'} fa-2x` }/>
                </div>
                {this.state.open && (
                <div>
                  {menu}
                </div>
                  )}
              </React.Fragment>
              ) : null
            }
          </Media>

          <h1>
            <strong>
              <Link to="/">
                <Logo/>
              </Link>
            </strong>
          </h1>
        </div>

        <div className="w-container">
          <div className="w-row">
            <nav className="w-col w-col-12 w-clearfix nav-column">
              {menu}
            </nav>
          </div>
        </div>
      </header>
    );
  }
}

export default (props) => (
  <StaticQuery
    query={ graphql`
        query HeaderQuery {
          site {
            siteMetadata {
              navigation {
                  path
                  displayName
              }
            }
          }
        }
      ` }

    render={ (data) => <Header data={ data } { ...props }/> }/>
);
