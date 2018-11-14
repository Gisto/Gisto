import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql, Link } from 'gatsby';

import Header from 'components/header';
import Footer from 'components/footer';

const Blog = ({ data }) => (
  <React.Fragment>
    <Helmet>
      <title>Blog</title>
    </Helmet>

    <Header/>

    <h1>Blog</h1>


    <section className="whiter boxes is-page-blog page-docs">
      <div className="w-container content-container">
        <div className="w-row w-col">

          {
              data.allMarkdownRemark.edges.map((post) => (
                <React.Fragment>
                  <h2>
                    <span>{post.node.frontmatter.date}</span>
                    {post.node.frontmatter.title}
                  </h2>

                  <p>{post.node.excerpt}</p>

                  <Link className="more" to={ post.node.frontmatter.path }> Read more <i
                    className="fa fa-chevron-right"/>
                  </Link>
                </React.Fragment>
              ))
            }

        </div>
      </div>
    </section>


    <Footer/>
  </React.Fragment>
  );

export const query = graphql`
  query {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            path
            title
          }
        }
      }
    }
  }
`;

export default Blog;
