import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { colorDanger } from 'constants/colors';

import Icon from 'components/common/Icon';

const Spinner = styled.div`
  border: 1px solid ${(props) => props.color ? props.color : '#fff'};
  border-top: 1px solid rgba(255,255,255,.3);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
  align-self: center;
  vertical-align: middle;
  display: inline-block;
  margin: 0 5px 0 0;

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

const loader = (color, text) => {
  if (window.navigator.onLine) {
    return (
      <React.Fragment>
        <Spinner color={ color }/> { text }
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Icon type="globe" color={ colorDanger }/> { 'Looks like you\'r off-line' }
    </React.Fragment>
  );
};

const Loading = ({ color, text }) => loader(color, text);

Loading.propTypes = {
  color: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.any
};

export default Loading;
