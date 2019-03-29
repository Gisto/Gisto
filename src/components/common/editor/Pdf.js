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

const Pdf = ({ file }) => (
  <StyledPdfWrapper>
    <Iframe
      title={ file.fillename }
      src={ `https://drive.google.com/viewerng/viewer?embedded=true&url=${file.raw_url}` }/>
  </StyledPdfWrapper>
);

Pdf.propTypes = {
  file: PropTypes.object
};

export default Pdf;
