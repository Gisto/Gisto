import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import marked from 'marked';
import 'highlight.js/styles/default.css';
import hljs from 'highlight.js';
import { get } from 'lodash/fp';

export const Markdown = ({ text, className, emoji }) => {
  const md = (textInput) => {
    const renderer = new marked.Renderer();

    renderer.text = (input) => {
      return input.replace(
        /:(.\w+?):/g,
        (matcher, capture) =>
          `<img src="${get(
            [capture],
            emoji
          )}" style="width: 18px;vertical-align: middle;background: transparent;"/>`
      );
    };

    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: (code) => hljs.highlightAuto(code).value,
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    });

    return marked(textInput || '', { renderer });
  };

  return (
    <div className={ `markdown-body ${className}` } dangerouslySetInnerHTML={ { __html: md(text) } }/>
  );
};

const mapStateToProps = (state) => ({
  emoji: get(['emoji', 'emoji'], state)
});

Markdown.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  emoji: PropTypes.object
};

export default connect(mapStateToProps)(Markdown);
