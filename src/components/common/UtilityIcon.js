import React from 'react';
import PropTypes from 'prop-types';
import { borderColor, lightText, colorDanger, lightBorderColor } from 'constants/colors';
import styled from 'styled-components';

import Icon from 'components/common/Icon';

const Util = styled.span`
  border-left: 1px solid ${borderColor};
  height: 51px;
  display: inline-block;
  width: 50px;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
  position: relative;
  
  &:hover {
    background: ${lightBorderColor};
  }
  
  ul {
    position: absolute;
    background: ${lightText};
    right: -1px;
    top: 51px;
    border: 1px solid ${borderColor};
    line-height: 21px;
    list-style-type: none;
    margin: 0;
    padding: 0;
    box-shadow: 0 5px 10px ${borderColor};
    z-index: 4;
    
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

export class UtilityIcon extends React.Component {
  state = {
    childrenShown: false
  };

  handleClick = () => {
    this.setState({
      childrenShown: this.state.childrenShown = !this.state.childrenShown
    });
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
      className
    } = this.props;
    const { childrenShown } = this.state;

    return (
      <Util className={ className }
            onClick={ () => dropdown ? this.handleClick() : onClick() }
            title={ title }>
        <Icon size={ size }
              type={ childrenShown ? 'close' : type }
              color={ childrenShown ? colorDanger : color }/>
        { dropdown && childrenShown && children }
      </Util>
    );
  }
}

UtilityIcon.propTypes = {
  children: PropTypes.node,
  size: PropTypes.number,
  type: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  dropdown: PropTypes.bool,
  title: PropTypes.string,
  className: PropTypes.string
};

export default UtilityIcon;
