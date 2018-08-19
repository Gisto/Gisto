import React from 'react';
import PropTypes from 'prop-types';

import { colorDanger } from 'constants/colors';

import Icon from 'components/common/Icon';


const loader = (color) => {
  if (window.navigator.onLine) {
    return (
      <React.Fragment>
        <Icon type="loading" color={ color }/> { 'loading...' }
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Icon type="globe" color={ colorDanger }/> { 'Looks like you\'r off-line' }
    </React.Fragment>
  );
};

const Loading = ({ color }) => loader(color);

Loading.propTypes = {
  text: PropTypes.string,
  children: PropTypes.any
};

export default Loading;
