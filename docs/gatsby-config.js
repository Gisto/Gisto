module.exports = {
    plugins: [
      'gatsby-plugin-sass',
      'gatsby-plugin-sharp',
      {
        resolve: 'gatsby-source-filesystem',
        options: {
          path: `${__dirname}/src/pages/blog`,
          name: 'markdown-pages'
        }
      },
      {
        resolve: 'gatsby-transformer-remark',
        options: {
          plugins: [
            {
              resolve: 'gatsby-remark-images',
              options: {
                // It's important to specify the maxWidth (in pixels) of
                // the content container as this plugin uses this as the
                // base for generating different widths of each image.
                maxWidth: 590
              }
            }
          ]
        }
      }
    ],
    siteMetadata: {
        title: 'Gisto',
        description: 'Snippets made awesome',
        navigation: [
          {
            path: '/',
            displayName: 'Home'
          },
          {
            path: 'features',
            displayName: 'Features'
          },
          {
            path: 'documentation',
            displayName: 'Docs'
          },
          {
            path: 'faq',
            displayName: 'F.A.Q.'
          },
          {
            path: 'blog',
            displayName: 'Blog'
          },
          {
            path: 'downloads',
            displayName: 'Download'
          }
        ],
        contributors: [
            {
                name: 'Maayan Glikser',
                gravatar: 'https://secure.gravatar.com/avatar/3a615b34ef2060face8fcd481c6377e1?s=80',
                site: 'https://www.glikm.com',
                twitter_name: 'MaayanGlikser',
                github_name: 'morsdyce',
                description: 'Software Developer'
            },
            {
                name: 'Sasha Khamkov',
                gravatar: 'https://secure.gravatar.com/avatar/7ddad1a9a1c8de452badaf82b6c30c76?s=80',
                site: 'https://www.sanusart.com',
                twitter_name: 'sanusart',
                github_name: 'sanusart',
                description: 'Web Developer'
            }
        ]
    }
};
