import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';

const Color = styled.input`
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 40px;
  background: none;
  vertical-align: middle;
  margin: 0 -3px 2px 5px;

  ::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  ::-webkit-color-swatch {
    border: none;
    border-radius: 40px;
  }
`;

const InputColor = ({ color, onChange }) => (
  <Color type="color" defaultValue={ color } onChange={ onChange }/>
);

InputColor.propTypes = {
  color: propTypes.string,
  onChange: propTypes.func
};

export default InputColor;
