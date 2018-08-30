import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  font-family: 'Roboto Condensed', sans-serif;
`;

const Title = styled.strong`
  font-weight: 700;
`;

const Body = styled.div`
  font-weight: 300;
  margin-top: 10px;
  font-size: 14px;
  
  b, strong {
    font-weight: 700;
  }
`;

const Notification = ({ title, body }) => (
  <Wrapper>
    { title && <Title dangerouslySetInnerHTML={ { __html: title } } /> }
    <Body dangerouslySetInnerHTML={ { __html: body } }/>
  </Wrapper>
);

Notification.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string
};

export default Notification;
