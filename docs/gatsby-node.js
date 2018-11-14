const path = require('path');

const { createFilePath } = require('gatsby-source-filesystem');

exports.onCreateNode = ({ node, action }) => {
  const { createNodeField } = action;

  if (node.internal.type === 'SitePage') {
    createNodeField({
      node,
      name: 'slug',
      value: node.path
    });
  }
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({
      node,
      getNode
    });

    createNodeField({
      name: 'slug',
      node,
      value
    });
  }
};


exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    resolve(graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
              fields{
                  slug
              }
            frontmatter {
              title
              path
            }
          }
        }
      }
    }
  `)
      .then((result) => {
        if (result.errors) {
          console.log(result.errors);

          return reject(result.errors);
        }

        const blogTemplate = path.resolve('./src/templates/blog-post.js');

        result.data.allMarkdownRemark.edges.forEach(({ node }) => {
          createPage({
            path: node.frontmatter.path,
            component: blogTemplate,
            context: {
              slug: node.fields.slug
            }
          });
        });
      }));
  });
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, './src'), 'node_modules']
    }
  });
};
