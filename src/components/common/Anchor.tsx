import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { IAnchor } from 'types/Interfaces.d';

const Link = styled.a`
  cursor: pointer;
  color: ${(props) => (props.color ? props.color : props.theme.baseAppColor)};
  text-decoration: none;

  :hover {
    color: ${(props) => props.theme.headerBgLightest};
  }
`;

const Anchor = ({ href, onClick, children, download, color, className }: IAnchor) => (
  <Link href={href} className={className} color={color} download={download} onClick={onClick}>
    {children}
  </Link>
);

Anchor.propTypes = {
  href: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  download: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string
};

export default Anchor;
