import React from 'react';
import PropTypes from 'prop-types';

export const HTML = (props) => {
  return (
    <html { ...props.htmlAttributes }>
      <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
        <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        {props.headComponents}
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:site" content="@gistoapp"/>
        <meta name="twitter:creator" content="@gistoapp"/>
        <meta name="twitter:title" content="Gisto - Manage your github gists on desktop"/>
        <meta name="twitter:description"
            content="Cross-platform gist snippets management desktop application that allows you and your team share code snippets fast and easily #gistoapp"/>
        <meta name="twitter:image"
            content="https://raw.githubusercontent.com/Gisto/Gisto/master/app/icon.png"/>
        <meta property="og:title" content="Gisto - Manage your github gists on desktop"/>
        <meta property="og:url" content="https://www.gistoapp.com"/>
        <meta property="og:image"
            content="https://raw.githubusercontent.com/Gisto/Gisto/master/app/icon.png"/>
        <meta property="og:site_name" content="Gistoapp"/>
        <meta property="og:description"
            content="Cross-platform gist snippets management desktop application that allows you and your team share code snippets fast and easily #gistoapp"/>

        <script type="text/javascript"
              dangerouslySetInnerHTML={ {
                __html: `
          //<![CDATA[
              var _gaq = _gaq || [];
              _gaq.push(['_setAccount', 'UA-40972813-1']);
              _gaq.push(['_trackPageview']);
              (function () {
                var ga = document.createElement('script');
                ga.type = 'text/javascript';
                ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
              })();
              //]]>
          `
              } }/>

        <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js"/>
        <script dangerouslySetInnerHTML={ {
        __html: `
             WebFont.load({
                google: {
                families: ["Open Sans:300,400,600,700,800", "Roboto:300,400,600,700,800"]
            }
            });
            `
      } }/>
        <script type="text/javascript" src="https://ws.sharethis.com/button/buttons.js"/>
        <script dangerouslySetInnerHTML={ {
        __html: `
            stLight.options({publisher: "6ccdc1be-66dc-486b-bd54-e41e194e96d5", doNotHash: false, doNotCopy: false, hashAddressBar: false});
            `
      } }/>
        <script type="text/javascript"
dangerouslySetInnerHTML={ {
        __html: `
        function sharePost(wUrl, wTitle, wWidth, wHeight) {
          var wTop = (screen.height / 2) - (wHeight / 2);
          var wLeft = (screen.width / 2) - (wWidth / 2);
          window.open(wUrl, wTitle, 'top=' + wTop + ',left=' + wLeft + ',toolbar=0,status=0,width=' + wWidth + ',height=' + wHeight);
        }
        `
      } }/>

      </head>
      <body { ...props.bodyAttributes }>
        {props.preBodyComponents}
        <div
      key="body"
      id="___gatsby"
      dangerouslySetInnerHTML={ { __html: props.body } }/>
        {props.postBodyComponents}
      </body>
    </html>
);
};

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array
};

export default HTML;
