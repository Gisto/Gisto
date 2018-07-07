import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  baseAppColor, borderColor, lightText, textColor 
} from 'constants/colors';
import Icon from 'components/common/Icon';

const ButtonComponent = styled.button`
  background: ${(props) => props.invert ? 'transparent' : baseAppColor};
  border: 1px solid ${baseAppColor};
  color: ${(props) => props.invert ? baseAppColor : lightText};
  border-radius: 3px;
  font-weight: 200;
  font-size: 14px;
  text-align: center;
  ${(props) => props.height ? `height: ${props.height};` : ''}
  ${(props) => props.width ? `width: ${props.width};` : ''}
  -webkit-appearance: none;
  cursor: pointer;
  
  &[disabled] {
    background: ${borderColor};
    border: 1px solid ${borderColor};
    color: ${textColor};
    cursor: not-allowed;
  }
`;

const Button = ({
  icon, children, width, height, invert, className, onClick, disabled
}) => {
  const iconColor = () => {
    if (invert) {
      return baseAppColor;
    } if (disabled) {
      return  textColor;
    } 
    
    return lightText;
  };

  return (
    <ButtonComponent invert={ invert }
                     width={ width }
                     disabled={ disabled }
                     title={ disabled ? 'Currently not available' : children }
                     height={ height }
                     className={ className }
                     onClick={ onClick }>
      <Icon color={ iconColor() }
            type={ icon }/> {children}
    </ButtonComponent>
  );
};

Button.propTypes = {
  icon: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  invert: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default Button;
