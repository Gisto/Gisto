import React from 'react';
import PropTypes from 'prop-types';
import styled, { css, withTheme } from 'styled-components';

import Icon from 'components/common/Icon';

const DropdownMixin = css`
  position: absolute;
  background: ${(props) => props.theme.lightText};
  right: 0;
  top: 51px;
  border: 1px solid ${(props) => props.theme.borderColor};
  line-height: 21px;
  list-style-type: none;
  margin: 0;
  padding: 0;
  box-shadow: 0 5px 10px ${(props) => props.theme.borderColor};
  z-index: 4;
  overflow: auto;
  max-height: 65vh;
  color: ${(props) => props.theme.baseAppColor};
  cursor: default;
`;

const Util = styled.span`
  border-left: 1px solid ${(props) => props.theme.borderColor};
  height: 50px;
  display: inline-block;
  text-align: center;
  line-height: 50px;
  color: ${(props) => (props.color ? props.color : 'inherit')};
  cursor: pointer;
  position: relative;
  background: ${(props) => (props.background ? props.background : 'inherit')};
  ${(props) => (props.text ? 'padding: 0 15px;' : '')}
  ${(props) => (props.text ? '' : 'width: 50px;')}
  
  &:hover {
    background: ${(props) => (props.background ? props.background : props.theme.lightBorderColor)};
  }

  div.list {
    ${DropdownMixin};
    padding: 10px 20px;
  }

  ul {
    ${DropdownMixin}

    li {
      border-bottom: 1px dotted ${(props) => props.theme.orderColor};
      margin: 0;
      white-space: nowrap;
      text-align: left;

      > * {
        padding: 5px 20px;
        display: block;
      }

      &:hover {
        background: ${(props) => props.theme.lightBorderColor};
        cursor: pointer;
      }

      &:last-child {
        border: none;
      }
    }
  }
`;

export class UtilityIcon extends React.Component {
  childrenDropdown = React.createRef();

  state = {
    childrenShown: false
  };

  toggleChildren = () => {
    if (!this.state.childrenShown) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }

    this.setState((prevState) => ({
      childrenShown: !prevState.childrenShown
    }));
  };

  handleOutsideClick = (e) => {
    if (
      this.childrenDropdown &&
      e.target &&
      this.childrenDropdown.current.contains(e.target) === false
    ) {
      this.toggleChildren();
    }
  };

  render() {
    const { lightText, colorDanger } = this.props.theme;
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
      <Util
        className={ className }
        background={ background }
        onClick={ () => (dropdown ? this.toggleChildren() : onClick()) }
        title={ title }
        text={ text }
        color={ childrenShown ? colorDanger : color }>
        <Icon
          size={ size }
          spin={ spin }
          type={ childrenShown ? 'close' : type }
          color={ childrenShown ? colorDanger : color }/>{' '}
        {text && text}
        {dropdown && childrenShown && <span ref={ this.childrenDropdown }>{children}</span>}
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
  spin: PropTypes.bool,
  title: PropTypes.string,
  className: PropTypes.string,
  background: PropTypes.string,
  text: PropTypes.string,
  theme: PropTypes.object
};

export default withTheme(UtilityIcon);
