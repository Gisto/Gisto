import React from 'react';
import PropTypes from 'prop-types';
import {
  baseAppColor, bg, disabledColor, lightText 
} from 'constants/colors';
import styled from 'styled-components';

const StyledInput = styled.textarea`
  border: none;
  border-radius: 0;
  margin-bottom: 10px;
  width: calc(100% - 20px);
  height: ${(props) => props.height ? props.height : '60px'};
  color: ${(props) => props.disabled ? disabledColor : baseAppColor};
  border-bottom: 1px solid ${(props) => props.disabled ? disabledColor : baseAppColor};
  background: ${(props) => props.disabled ? disabledColor : lightText};
  line-height: 21px;
  padding: 10px;

  &:focus {
    outline: none;
  }
  
  ::placeholder {
      color: ${(props) => props.disabled ? disabledColor : bg};
      opacity: 1;
  }
`;

const TextArea = ({
  placeholder, onChange, className, value, autoFocus, disabled = false, title = ''
}) => (
  <StyledInput className={ className }
               autoFocus={ autoFocus }
               title={ title }
               disabled={ disabled }
               onChange={ onChange }
               defaultValue={ value }
               placeholder={ placeholder }/>
);

TextArea.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  value: PropTypes.string,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  title: PropTypes.string
};

export default TextArea;
