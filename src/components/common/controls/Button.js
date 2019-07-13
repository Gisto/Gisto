import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { get } from 'lodash/fp';

import Icon from 'components/common/Icon';

const ButtonComponent = styled.button`
  background: ${(props) => (props.invert ? 'transparent' : props.theme.baseAppColor)};
  border: 1px solid ${(props) => (props.outline ? props.theme.lightText : props.theme.baseAppColor)};
  color: ${(props) => (props.invert ? props.theme.baseAppColor : props.theme.lightText)};
  border-radius: 3px;
  font-weight: 200;
  font-size: 14px;
  text-align: center;
  ${(props) => (props.height ? `height: ${props.height};` : '')}
  ${(props) => (props.width ? `width: ${props.width};` : '')}
  -webkit-appearance: none;
  cursor: pointer;
  align-items: center;
  display: flex;
  white-space: pre;

  &[disabled] {
    background: ${(props) => props.theme.borderColor};
    border: 1px solid ${(props) => props.theme.borderColor};
    color: ${(props) => props.theme.textColor};
    cursor: not-allowed;
  }
`;

export const Button = ({
  icon,
  children,
  width,
  height,
  invert,
  outline,
  className,
  onClick,
  disabled,
  theme,
  ...rest
}) => {
  const iconColor = () => {
    if (invert) {
      return theme.baseAppColor;
    }
    if (disabled) {
      return theme.textColor;
    }

    return theme.lightText;
  };

  return (
    <ButtonComponent
      invert={ invert }
      outline={ outline }
      width={ width }
      disabled={ disabled }
      title={ disabled ? 'Currently not available' : rest.title }
      height={ height }
      className={ className }
      onClick={ onClick }>
      <Icon color={ iconColor() } type={ icon }/> {children}
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
  outline: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  theme: PropTypes.object
};

const mapStateToProps = (state) => ({
  theme: get(['ui', 'settings', 'theme'], state)
});

export default connect(mapStateToProps)(Button);
