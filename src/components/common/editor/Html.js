import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledPdfWrapper = styled.div`
  width: 100%;
  height: 70vh;
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const Html = ({ file }) => (
  <StyledPdfWrapper>
    <Iframe sandbox="" srcDoc={ file.content }/>
  </StyledPdfWrapper>
);

Html.propTypes = {
  file: PropTypes.object
};

export default Html;
