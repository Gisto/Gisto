import React from 'react';
import PropTypes from 'prop-types';
import { getLanguages, getSnippets } from 'selectors/snippets';
import { connect } from 'react-redux';
import * as snippetActions from 'actions/snippets';
import { get, map, size } from 'lodash/fp';
import styled from 'styled-components';

import { baseAppColor, headerBgLightest } from 'constants/colors';

const Pill = styled.span`
  border: 1px solid ${headerBgLightest};
  color: ${baseAppColor};
  padding: 5px;
  border-radius: 3px;
  position: relative;
  text-overflow: clip;
  overflow: hidden;
  &:hover {
    border: 1px solid ${baseAppColor};
  }
  
  &:after {
    content: "";
    width: 30px;
    height: 20px;
    position: absolute;
    top: 3px;
    right: 0;
    background: -webkit-gradient(linear,left top,right top,color-stop(0%,rgba(255,255,255,0)),color-stop(56%,rgba(255,255,255,1)),color-stop(100%,rgba(255,255,255,1)));
    background: -webkit-linear-gradient(left,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 56%,rgba(255,255,255,1) 100%);
  }
`;

export const Languagelist = ({ snippetsLanguages, searchByLanguages, snippets }) => {
  const linearGradient = (percentOf) => {
    const percents = (percentOf / size(snippets)) * 100;

    return {
      background: `linear-gradient(to right, ${headerBgLightest} ${Math.floor(percents)}%, #fff ${Math.floor(percents)}%)`
    };
  };

  const renderLanguages = () => map((languageItem) => {
    const language = get('language', languageItem);
    const filesCount = get('size', languageItem);

    return (
      <Pill style={ linearGradient(filesCount) }
            key={ language }
            onClick={ () => searchByLanguages(language) }>
        { language || 'Other' }
        <br/>
        <strong>{ filesCount }</strong> <small>files</small>
      </Pill>
    );
  }, snippetsLanguages);

  return (
    <React.Fragment>
      { renderLanguages() }
    </React.Fragment>
  );
};

Languagelist.propTypes = {
  snippetsLanguages: PropTypes.array,
  snippets: PropTypes.object,
  searchByLanguages: PropTypes.func
};

const mapStateToProps = (state) => ({
  snippetsLanguages: getLanguages(state),
  snippets: getSnippets(state)
});

export default connect(mapStateToProps, {
  searchByLanguages: snippetActions.filterSnippetsByLanguage
})(Languagelist);
