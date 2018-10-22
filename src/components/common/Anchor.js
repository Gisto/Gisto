import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Link = styled.a`
  cursor: pointer;
  color: ${(props) => props.color ? props.color : props.theme.baseAppColor};
  text-decoration: none;

  :hover {
    color: ${(props) => props.theme.headerBgLightest};
  }
`;

const Anchor = ({
  href, onClick, children, download, color, className
}) => (
  <Link href={ href }
        className={ className }
        color={ color }
        download={ download }
        onClick={ onClick }>
    { children }
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
