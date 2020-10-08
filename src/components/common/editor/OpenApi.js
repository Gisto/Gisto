import React from 'react';
import PropTypes from 'prop-types';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const OpenApi = ({ url, className }) => {
  return <SwaggerUI className={ `open-api-body ${className}` } url={ url }/>;
};

OpenApi.propTypes = {
  url: PropTypes.string,
  className: PropTypes.string
};

export default OpenApi;
