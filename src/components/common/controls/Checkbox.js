import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Box = styled.input`
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeSpeed;
  width: 15px;
  height: 15px;
  margin-right: 1px;
  display: block;
  float: left;
  position: relative;
  cursor: pointer;
  -webkit-appearance: none;
  outline: none;

  :after {
    content: '';
    vertical-align: middle;
    text-align: center;
    line-height: 15px;
    position: absolute;
    cursor: pointer;
    height: 15px;
    width: 15px;
    left: 0;
    top: 0;
    font-size: 10px;
    border: 1px solid ${(props) => props.theme.baseAppColor};
    background: #fff;
  }

  :checked:after {
    content: '\\2714';
    color: ${(props) => props.theme.baseAppColor};
  }
`;

const Checkbox = ({ checked, onChange, className }) => (
  <Box type="checkbox" className={ className } defaultChecked={ checked } onChange={ onChange }/>
);

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string
};

export default Checkbox;
