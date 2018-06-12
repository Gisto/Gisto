import React from 'react';
import PropType from 'prop-types';
import { shell } from 'electron';
import { isElectron } from 'utils/electron';
import Anchor from 'components/common/Anchor';

const ExternalLink = ({
  href, className, children
}) => (
  <Anchor className={ className }
     href="#"
     onClick={ (event) => {
       event.preventDefault();

       return isElectron ? shell.openExternal(href) : window.open(href, '_blank');
     } }>
    { children }
  </Anchor>
);

ExternalLink.propTypes = {
  href: PropType.string,
  className: PropType.string,
  children: PropType.node
};

export default ExternalLink;
