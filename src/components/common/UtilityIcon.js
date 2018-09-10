import React from 'react';
import PropTypes from 'prop-types';
import {
  borderColor, lightText, colorDanger, lightBorderColor, baseAppColor
} from 'constants/colors';
import styled, { css } from 'styled-components';

import Icon from 'components/common/Icon';

const DropdownMixin = css`
  position: absolute;
  background: ${lightText};
  right: 0;
  top: 51px;
  border: 1px solid ${borderColor};
  line-height: 21px;
  list-style-type: none;
  margin: 0;
  padding: 0;
  box-shadow: 0 5px 10px ${borderColor};
  z-index: 4;
  overflow: auto;
  max-height: 60vh;
  color: ${baseAppColor};
  cursor: default;
`;

export class UtilityIcon extends React.Component {
  state = {
    childrenShown: false
  };

  toggleChildren = () => {
    this.setState((prevState) => ({
      childrenShown: !prevState.childrenShown
    }));
  };

  render() {
    const {
      children,
      size = 22,
      type,
      color = lightText,
      onClick = null,
      dropdown = false,
      title,
      className,
      background,
      text,
      spin
    } = this.props;
    const { childrenShown } = this.state;

    return (
      <Util className={ className }
            background={ background }
            onClick={ () => dropdown ? this.toggleChildren() : onClick() }
            title={ title }
            text={ text }
            color={ childrenShown ? colorDanger : color }>
        <Icon size={ size }
              spin={ spin }
              type={ childrenShown ? 'close' : type }
              color={ childrenShown ? colorDanger : color }/> { text && text }
        { dropdown && childrenShown && children }
      </Util>
    );
  }
}

const Util = styled.span`
  border-left: 1px solid ${borderColor};
  height: 50px;
  display: inline-block;
  text-align: center;
  line-height: 50px;
  color: ${(props) => props.color ? props.color : 'inherit'};
  cursor: pointer;
  position: relative;
  background: ${(props) => props.background ? props.background : 'inherit'};
  ${(props) => props.text ? 'padding: 0 15px;' : ''}
  ${(props) => props.text ? '' : 'width: 50px;'}
  
  &:hover {
    background: ${(props) => props.background ? props.background : lightBorderColor};
  }
  
  div.list {
    ${DropdownMixin};
    padding: 10px 20px;
  }
  
  ul {
    ${DropdownMixin}
    
    li {
      border-bottom: 1px dotted ${borderColor};
      margin: 0;
      padding: 5px 20px;
      white-space: nowrap;
      text-align: left;
      
      &:hover {
        background: ${lightBorderColor};
        cursor: pointer;
      }
      
      &:last-child {
        border: none;
      }  
    }
  }
`;

UtilityIcon.propTypes = {
  children: PropTypes.node,
  size: PropTypes.number,
  type: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  dropdown: PropTypes.bool,
  spin: PropTypes.bool,
  title: PropTypes.string,
  className: PropTypes.string,
  background: PropTypes.string,
  text: PropTypes.string
};

export default UtilityIcon;
