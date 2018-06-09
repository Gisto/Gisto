import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { baseAppColor, lightText } from 'constants/colors';
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
`;

const Button = ({
  icon, children, width, height, invert, className, onClick
}) => (
  <ButtonComponent invert={ invert }
                   width={ width }
                   height={ height }
                   className={ className }
                   onClick={ onClick }>
    <Icon color={ invert ? baseAppColor : lightText }
          type={ icon }/> { children }
  </ButtonComponent>
);

Button.propTypes = {
  icon: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  invert: PropTypes.bool,
  onClick: PropTypes.func
};

export default Button;
