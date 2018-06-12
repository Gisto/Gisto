import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { baseAppColor } from 'constants/colors';

const Link = styled.a`
  cursor: pointer;
  margin: 0 5px 0 0;
  color: ${baseAppColor};
  text-decoration: none;
`;

const Anchor = ({
  key, href, onClick, children 
}) => (
  <Link href={ href }
        key={ key }

        onClick={ onClick }>
    { children }
  </Link>
);

Anchor.propTypes = {
  href: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  key: PropTypes.any
};

export default Anchor;
