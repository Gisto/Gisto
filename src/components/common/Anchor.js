import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { baseAppColor } from 'constants/colors';

const Link = styled.a`
  cursor: pointer;
  color: ${baseAppColor};
  text-decoration: none;
`;

const Anchor = ({
  key, href, onClick, children, download
}) => (
  <Link href={ href }
        key={ key }
        download={ download }
        onClick={ onClick }>
    { children }
  </Link>
);

Anchor.propTypes = {
  href: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  key: PropTypes.any,
  download: PropTypes.string
};

export default Anchor;
