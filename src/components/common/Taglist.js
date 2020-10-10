import React from 'react';
import PropTypes from 'prop-types';
import { getTagsWithCounts, getSnippets } from 'selectors/snippets';
import { connect } from 'react-redux';
import { withTheme } from 'styled-components';

import * as snippetActions from 'actions/snippets';
import { filter, get, isEmpty, map, size } from 'lodash/fp';

import { Pill } from 'components/common/Pill';

export const Taglist = ({ snippets, searchTags, searchByTags, snippetsTags, theme }) => {
  const taggedSnippets = filter((snippet) => !isEmpty(snippet.tags), snippets);
  const linearGradient = (percentOf) => {
    const percents = (percentOf / size(taggedSnippets)) * 100;

    return {
      background: `linear-gradient(to right, ${theme.headerBgLightest} ${Math.floor(
        percents
      )}%, #fff ${Math.floor(percents)}%)`
    };
  };

  const renderTags = () => {
    let list = snippetsTags;

    if (!isEmpty(searchTags)) {
      list = filter(
        (tag) => tag.tag.toLowerCase().includes(searchTags.toLowerCase()),
        snippetsTags
      );
    }

    return map((tagItem) => {
      const tag = get('tag', tagItem);
      const filesCount = get('size', tagItem);

      return (
        <Pill
          title={ tag }
          style={ linearGradient(filesCount) }
          key={ tag }
          onClick={ () => searchByTags(tag) }>
          {tag}
          <br/>
          <strong>{filesCount}</strong> <small>{filesCount > 1 ? 'snippets' : 'snippet'}</small>
        </Pill>
      );
    }, list);
  };

  return <React.Fragment>{renderTags()}</React.Fragment>;
};

Taglist.propTypes = {
  snippets: PropTypes.object,
  theme: PropTypes.object,
  searchTags: PropTypes.string,
  searchByTags: PropTypes.func,
  snippetsTags: PropTypes.array
};

const mapStateToProps = (state) => ({
  snippets: getSnippets(state),
  snippetsTags: getTagsWithCounts(state)
});

export default withTheme(
  connect(
    mapStateToProps,
    {
      searchByTags: snippetActions.filterSnippetsByTags
    }
  )(Taglist)
);
