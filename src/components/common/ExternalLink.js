import React from 'react';
import PropType from 'prop-types';
import { shell } from 'electron';
import { isElectron } from 'utils/electron';

const ExternalLink = ({
  href, className, download, children 
}) => (
  <a className={ className }
     download={ download }
     href={ download ? href : '#' }
     onClick={ () => isElectron ? shell.openExternal(href) : window.open(href, '_blank') }>
    { children }
  </a>
);

ExternalLink.propTypes = {
  href: PropType.string,
  className: PropType.string,
  children: PropType.node,
  download: PropType.string
};

export default ExternalLink;
