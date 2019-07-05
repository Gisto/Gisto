import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import katex from 'katex';

import 'katex/dist/katex.css';

const Katex = ({ text, className }) => {
  const html = katex.renderToString(text.toString(), {
    throwOnError: false
  });

  return <TeX className={ `latex-body ${className}` } dangerouslySetInnerHTML={ { __html: html } }/>;
};

Katex.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string
};

const TeX = styled.div`
  padding: 20px;
`;

export default Katex;
