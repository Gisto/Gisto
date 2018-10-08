import React from 'react';
import PropTypes from 'prop-types';
import { getTagsWithCounts, getSnippets } from 'selectors/snippets';
import { connect } from 'react-redux';
import * as snippetActions from 'actions/snippets';
import {
  filter, get, isEmpty, map, size
} from 'lodash/fp';

import { headerBgLightest } from 'constants/colors';

import { Pill } from 'components/common/Pill';

export const Taglist = ({
  snippets, searchTags, searchByTags, snippetsTags
}) => {
  const taggedSnippets = filter((snippet) => !isEmpty(snippet.tags), snippets);
  const linearGradient = (percentOf) => {
    const percents = (percentOf / size(taggedSnippets)) * 100;

    return {
      background: `linear-gradient(to right, ${headerBgLightest} ${Math.floor(percents)}%, #fff ${Math.floor(percents)}%)`
    };
  };

  const renderTags = () => {
    let list = snippetsTags;

    if (!isEmpty(searchTags)) {
      list = filter((tag) => {
        const regex = new RegExp(searchTags, 'gi');

        return tag.tag.match(regex);
      }, snippetsTags);
    }

    return map((tagItem) => {
      const tag = get('tag', tagItem);
      const filesCount = get('size', tagItem);

      return (
        <Pill style={ linearGradient(filesCount) }
              key={ tag }
              onClick={ () => searchByTags(tag) }>
          { tag }
          <br/>
          <strong>{ filesCount }</strong> <small>snippets</small>
        </Pill>
      );
    }, list);
  };

  return (
    <React.Fragment>
      { renderTags() }
    </React.Fragment>
  );
};

Taglist.propTypes = {
  snippets: PropTypes.object,
  searchTags: PropTypes.string,
  searchByTags: PropTypes.func,
  snippetsTags: PropTypes.array
};

const mapStateToProps = (state) => ({
  snippets: getSnippets(state),
  snippetsTags: getTagsWithCounts(state)
});

export default connect(mapStateToProps, {
  searchByTags: snippetActions.filterSnippetsByTags
})(Taglist);
