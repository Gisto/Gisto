import React from 'react';
import PropTypes from 'prop-types';
import { getLanguagesWithCounts, getSnippets } from 'selectors/snippets';
import { connect } from 'react-redux';
import { withTheme } from 'styled-components';
import * as snippetActions from 'actions/snippets';
import { get, map, size } from 'lodash/fp';

import { Pill } from 'components/common/Pill';

export const Languagelist = ({ snippetsLanguages, searchByLanguages, snippets, theme }) => {
  const linearGradient = (percentOf) => {
    const percents = (percentOf / size(snippets)) * 100;

    return {
      background: `linear-gradient(to right, ${theme.headerBgLightest} ${Math.floor(
        percents
      )}%, #fff ${Math.floor(percents)}%)`
    };
  };

  const renderLanguages = () =>
    map((languageItem) => {
      const language = get('language', languageItem);
      const filesCount = get('size', languageItem);

      return (
        <Pill
          style={ linearGradient(filesCount) }
          key={ language }
          clickable={ language !== null }
          onClick={ () => searchByLanguages(language) }>
          {language || 'Other'}
          <br/>
          <strong>{filesCount}</strong> <small>{filesCount > 1 ? 'files' : 'file'}</small>
        </Pill>
      );
    }, snippetsLanguages);

  return <React.Fragment>{renderLanguages()}</React.Fragment>;
};

Languagelist.propTypes = {
  snippetsLanguages: PropTypes.array,
  snippets: PropTypes.object,
  theme: PropTypes.object,
  searchByLanguages: PropTypes.func
};

const mapStateToProps = (state) => ({
  snippetsLanguages: getLanguagesWithCounts(state),
  snippets: getSnippets(state)
});

export default withTheme(
  connect(
    mapStateToProps,
    {
      searchByLanguages: snippetActions.filterSnippetsByLanguage
    }
  )(Languagelist)
);
