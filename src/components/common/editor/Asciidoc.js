import React from 'react';
import PropTypes from 'prop-types';
import Asciidoctor from 'asciidoctor.js';
import 'highlight.js/styles/default.css';

const Asciidoc = ({ text, className }) => {
  const asciidoctor = Asciidoctor();
  const html = asciidoctor.convert(text);

  return (
    <div className={ `markdown-body ${className}` } dangerouslySetInnerHTML={ { __html: html } }/>
  );
};

Asciidoc.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string
};

export default Asciidoc;
