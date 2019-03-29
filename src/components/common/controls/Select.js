import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SelectInput = styled.select`
  -webkit-appearance: none;
  border: 1px solid ${(props) => props.theme.baseAppColor};
  line-height: 1;
  outline: 0;
  color: ${(props) => props.theme.baseAppColor};
  padding: 5px;
  border-radius: 0;
  background: linear-gradient(
        ${(props) => props.theme.baseAppColor},
        ${(props) => props.theme.baseAppColor}
      )
      no-repeat,
    linear-gradient(-135deg, rgba(255, 255, 255, 0) 50%, white 50%) no-repeat,
    linear-gradient(-225deg, rgba(255, 255, 255, 0) 50%, white 50%) no-repeat,
    linear-gradient(${(props) => props.theme.baseAppColor}, ${(props) => props.theme.baseAppColor})
      no-repeat;
  background-color: #fff;
  background-size: 1px 100%, 20px 20px, 20px 20px, 20px 15px;
  background-position: right 20px center, right bottom, right bottom, right bottom;
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.baseAppColor};

  option {
    background-color: white;
  }
`;

const Select = ({ value, onChange, className, children, ...rest }) => (
  <SelectInput className={ className } defaultValue={ value } onChange={ onChange } { ...rest }>
    {children}
  </SelectInput>
);

Select.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
};

export default Select;
