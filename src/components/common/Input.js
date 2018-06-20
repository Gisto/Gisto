import React from 'react';
import PropTypes from 'prop-types';
import { baseAppColor, bg, lightText } from 'constants/colors';
import styled from 'styled-components';

const StyledInput = styled.input`
  border: none;
  border-radius: 0;
  height: 30px;
  margin: 10px;
  width: 100%;
  color: ${baseAppColor};
  border-bottom: 1px solid ${baseAppColor};
  background: ${lightText};

  &:focus {
    outline: none;
  }
  
  ::placeholder {
      color: ${bg};
      opacity: 1;
  }
`;

const Input = ({
  type = 'text', placeholder, onChange, className, value, autoFocus
}) => (
  <StyledInput type={ type }
               className={ className }
               autoFocus={ autoFocus }
               onChange={ onChange }
               value={ value }
               placeholder={ placeholder }/>
);

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  value: PropTypes.string,
  autoFocus: PropTypes.bool
};

export default Input;
