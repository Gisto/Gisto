import React from 'react';
import PropTypes from 'prop-types';
import { getSnippets } from 'selectors/snippets';
import { connect } from 'react-redux';
import * as snippetActions from 'actions/snippets';
import {
  compact, filter, flattenDeep, flow, isEmpty, map, uniq
} from 'lodash/fp';
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

export const Taglist = ({
  snippets, searchTags, searchByTags
}) => {
  const getTags = () => {
    const tags = map('tags', snippets);

    const tagList = flow([
      flattenDeep,
      uniq,
      compact
    ])(tags);

    if (!isEmpty(searchTags)) {
      return filter((tag) => {
        const regex = new RegExp(searchTags, 'gi');

        return tag.match(regex);
      }, tagList.sort());
    }

    return tagList.sort();
  };

  return (
    <React.Fragment>
      { map((tag) => (
        <Pill key={ tag } onClick={ () => searchByTags(tag) } title={ tag }>
          { tag }
        </Pill>
      ), getTags()) }
    </React.Fragment>
  );
};

Taglist.propTypes = {
  snippets: PropTypes.object,
  searchTags: PropTypes.string,
  searchByTags: PropTypes.func
};

const mapStateToProps = (state) => ({
  snippets: getSnippets(state)
});

export default connect(mapStateToProps, {
  searchByTags: snippetActions.filterSnippetsByTags
})(Taglist);
