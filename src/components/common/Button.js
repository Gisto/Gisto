import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { baseAppColor, lightText } from 'constants/colors';
import Icon from 'components/common/Icon';

const ButtonComponent = styled.div`
  background: ${baseAppColor};
  border: 1px solid ${baseAppColor};
  color: ${lightText};
  border-radius: 3px;
  height: 30px;
  margin: 10px 0;
  font-weight: 200;
  font-size: 14px;
  display: flex;
  align-items: center;
  width: 50%;
  
  &[invert] {
    background: #fff;
    border: 1px solid #fff;
    color: ${baseAppColor};
  }
`;

const Button = ({ icon, children }) => (
  <ButtonComponent>
    <Icon invert type={ icon }/> { children }
  </ButtonComponent>
);

Button.propTypes = {
  icon: PropTypes.string,
  children: PropTypes.node
};

export default Button;
