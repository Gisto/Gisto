import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { baseAppColor, headerBgLightest } from 'constants/colors';

const Link = styled.a`
  cursor: pointer;
  color: ${baseAppColor};
  text-decoration: none;
  
  :hover {
    color: ${headerBgLightest};
  }
`;

const Anchor = ({
  href, onClick, children, download
}) => (
  <Link href={ href }
        download={ download }
        onClick={ onClick }>
    { children }
  </Link>
);

Anchor.propTypes = {
  href: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  download: PropTypes.string
};

export default Anchor;
