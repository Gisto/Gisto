import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, join, map } from 'lodash/fp';
import styled from 'styled-components';
import { baseAppColor, borderColor, colorDanger, colorSuccess, textColor } from 'constants/colors';
import Icon from 'components/common/Icon';

const SnippetHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Title = styled.div`
    flex: 1;
    text-align: left;
    padding: 1px 20px 1px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    &:after {
      content: "";
      width: 100px;
      height: 50px;
      position: absolute;
      top: 0;
      right: 0;
      background: -webkit-gradient(linear, left top, right top, color-stop(0%, rgba(255, 255, 255, 0)), color-stop(56%, rgba(255, 255, 255, 1)), color-stop(100%, rgba(255, 255, 255, 1)));
      background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 56%, rgba(255, 255, 255, 1) 100%);
    }
`;

const Description = styled.span`
  color: ${textColor};
`;

const Languages = styled.span`
  color: ${baseAppColor};
  border: 1px solid ${baseAppColor}
  font-size: 11px;
  padding: 1px 3px;
  border-radius: 2px;
  margin: 0 5px 0 0;
  vertical-align: middle;
`;

const Util = styled.span`
  border-left: 1px solid ${borderColor};
  height: 51px;
  display: inline-block;
  width: 50px;
  text-align: center;
  line-height: 50px;
`;

const SnippetHeader = ({ snippets, match }) => {
  const snippet = get(match.params.id, snippets);

  return (
    <SnippetHeaderWrapper>
      <Title>
        { map((language) => <Languages key={ `${language}${snippet.id}` }>{ language }</Languages>, get('languages', snippet)) }
        &nbsp;
        <Description title={ get('description', snippet) }>{ get('description', snippet) }</Description> { join(', ', get('tags', snippet)) }
      </Title>
      <div>
        <Util><Icon size={ 22 } color={ baseAppColor } type="edit"/></Util>
        <Util><Icon size={ 22 } color={ baseAppColor } type="file"/></Util>
        <Util><Icon size={ 22 } color={ baseAppColor } type="unlock"/></Util>
        <Util><Icon size={ 22 } color={ colorDanger } type="delete"/></Util>
        <Util><Icon size={ 22 } color={ baseAppColor } type="chat"/></Util>
        <Util><Icon size={ 22 } color={ baseAppColor } type="star-full"/></Util>
        <Util><Icon size={ 22 } color={ baseAppColor } type="ellipsis"/></Util>
      </div>
    </SnippetHeaderWrapper>
  );
};

const mapStateToProps = (state) => ({
  snippets: state.snippets.snippets
});

SnippetHeader.propTypes = {
  snippets: PropTypes.object,
  match: PropTypes.object
};

export default connect(mapStateToProps)(SnippetHeader);
