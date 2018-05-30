import React from 'react';
import PropTypes from 'prop-types';
import { baseAppColor } from 'constants/colors';
import styled from 'styled-components';

const StyledInput = styled.input`
  border: none;
  border-radius: 0;
  height: 30px;
  margin: 10px;
  width: 100%;
  color: ${baseAppColor};
  border-bottom: 1px solid ${baseAppColor};
  &:focus {
    outline: none;
  }
`;

const Input = ({ type = 'text', placeholder, onChange }) => (
  <StyledInput type={ type }
               onChange={ onChange }
               placeholder={ placeholder }/>
);

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func
};

export default Input;
