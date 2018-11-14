import React from 'react';
import { graphql, Link } from 'gatsby';
import { DiscussionEmbed } from 'disqus-react';

import Header from 'components/header';
import Footer from 'components/footer';

const BlogPost = ({ data, location }) => {
  const url = `https://www.gistoapp.com${location.pathname}`;
  const title = data.markdownRemark.frontmatter.title;
  const disqusShortname = 'gisto';
  const disqusConfig = {
    url,
    title,
    identifier: title
  };

  return (
    <React.Fragment>
      <Header/>
      <section className="is-page-blog inner post">

        <h1>{title}</h1>

        <section className="whiter boxes">


          <div className="w-container main content-container">
            <div className="w-row w-col">

              <Link to="blog" className="more btn bg-grey back"><i
                className="fa fa-chevron-left"/> Back
              </Link>

              <h2>{data.markdownRemark.frontmatter.post_title}</h2>

              <p>
                <i>by <b>{data.markdownRemark.frontmatter.author}</b> | {data.markdownRemark.frontmatter.date}
                </i>
              </p>


              <div dangerouslySetInnerHTML={ { __html: data.markdownRemark.html } }/>

              <br/>

            </div>


            <a
              href={ `javascript:sharePost('http://twitter.com/share?url=${url}&amp;text=${title} @gistoapp','Sahare ${title} via Twitter',520,350);` }
              className="btn bg-grey twitter txt-white"><i className="fa fa-twitter"/>
            </a>
            &nbsp;
            <a
              href={ `javascript:sharePost('http://www.facebook.com/sharer.php?p[title]=Gisto&p[summary]=${title}&p[url]=${url}','Sahare ${title} via Facebook',520,350);` }
              className="btn bg-grey fb txt-white"><i className="fa fa-facebook"/>
            </a>
            &nbsp;
            <a
              href={ `javascript:sharePost('https://plus.google.com/share?url=${url}','Sahare ${title} via Google+',520,350);` }
              className="btn bg-grey gplus txt-white"><i className="fa fa-google-plus"/>
            </a>
            &nbsp;
            <a
              href={ `mailto:?Subject=Gisto: ${title}&amp;Body=${title} at ${url}` }
              className="btn bg-grey txt-white"><i className="fa fa-envelope"/>
            </a>

          </div>


        </section>

        <h3 className="post">Comments</h3>

        <section className="whiter boxes">

          <div className="w-container main content-container">
            <div className="w-row w-col">
              <DiscussionEmbed shortname={ disqusShortname } config={ disqusConfig }/>
            </div>
          </div>
        </section>

      </section>
      <Footer/>
    </React.Fragment>
  );
};

export default BlogPost;

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: {path: {eq: $path}}) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        author
        post_title
      }
    }
  }
`;
