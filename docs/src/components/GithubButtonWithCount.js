import React from 'react';
import PropTypes from 'prop-types';

const GithubButtonWithCount = ({
  user, repo, type, count
}) => (
  <iframe
    title={ type }
    src={ `https://ghbtns.com/github-btn.html?user=${user}&repo=${repo}&type=${type}&count=${count}` }
    allowTransparency="true"
    frameBorder="0"
    scrolling="0"
    width="95"
    height="20"/>
);


GithubButtonWithCount.propTypes = {
  user: PropTypes.string,
  repo: PropTypes.string,
  type: PropTypes.string,
  count: PropTypes.bool
};

export default GithubButtonWithCount;
