import React from 'react';
import PropType from 'prop-types';
import Anchor from 'components/common/Anchor';
import { isomorphicHrefRedirect } from 'utils/isomorphic';

const ExternalLink = ({ href, className, children }) => (
  <Anchor
    className={ className }
    href="#"
    onClick={ (event) => {
      event.preventDefault();
      isomorphicHrefRedirect(href);
    } }>
    {children}
  </Anchor>
);

ExternalLink.propTypes = {
  href: PropType.string,
  className: PropType.string,
  children: PropType.node
};

export default ExternalLink;
