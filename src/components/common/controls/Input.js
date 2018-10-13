import React from 'react';
import PropTypes from 'prop-types';
import {
  baseAppColor, bg, disabledColor, lightText 
} from 'constants/colors';
import styled from 'styled-components';

const StyledInput = styled.input`
  border: none;
  border-radius: 0;
  height: 30px;
  //margin: 10px;
  //padding: 0 5px 0 5px;
  //width: 100%;
  color: ${(props) => props.disabled ? disabledColor : baseAppColor};
  border-bottom: 1px solid ${(props) => props.disabled ? disabledColor : baseAppColor};
  background: ${(props) => props.disabled ? disabledColor : lightText};

  &:focus {
    outline: none;
  }
  
  ::placeholder {
      color: ${(props) => props.disabled ? disabledColor : bg};
      opacity: 1;
  }
`;

const Input = ({
  type = 'text', placeholder, onChange, className, value,
  autoFocus, disabled = false, title = '', min, max
}) => (
  <StyledInput type={ type }
               className={ className }
               autoFocus={ autoFocus }
               title={ title }
               disabled={ disabled }
               onChange={ onChange }
               defaultValue={ value }
               placeholder={ placeholder }
               min={ min }
               max={ max }/>
);

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  title: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number
};

export default Input;
