import React from 'react';
import PropTypes from 'prop-types';
import { baseAppColor, bg } from 'constants/colors';
import styled from 'styled-components';

const StyledTextArea = styled.textarea`
  border: none;
  border-radius: 0;
  height: 100px;
  margin: 10px;
  width: 100%;
  color: ${baseAppColor};
  border-bottom: 1px solid ${baseAppColor};

  &:focus {
    outline: none;
  }
  
  ::placeholder {
      color: ${bg};
      opacity: 1;
  }
`;

const TextArea = ({ placeholder, onChange, className }) => (
  <StyledTextArea cols="30"
                  rows="10"
                  className={ className }
                  onChange={ onChange }
                  placeholder={ placeholder }/>
);

TextArea.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string
};

export default TextArea;
