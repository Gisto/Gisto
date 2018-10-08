import React from 'react';
import PropTypes from 'prop-types';
import { getLanguagesWithCounts, getSnippets } from 'selectors/snippets';
import { connect } from 'react-redux';
import * as snippetActions from 'actions/snippets';
import { get, map, size } from 'lodash/fp';

import { headerBgLightest } from 'constants/colors';

import { Pill } from 'components/common/Pill';

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
  snippetsLanguages: getLanguagesWithCounts(state),
  snippets: getSnippets(state)
});

export default connect(mapStateToProps, {
  searchByLanguages: snippetActions.filterSnippetsByLanguage
})(Languagelist);
