import { isEmpty } from 'lodash/fp';
import PropTypes from 'prop-types';
import React from 'react';
import styled, { withTheme } from 'styled-components';

import Anchor from 'components/common/Anchor';

import { INotification } from 'types/Interfaces.d';

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

  b,
  strong {
    font-weight: 700;
  }
`;

const Notification = ({ title, body, actions, theme }: INotification) => (
  <Wrapper>
    {title && <Title dangerouslySetInnerHTML={{ __html: title }} />}
    <Body dangerouslySetInnerHTML={{ __html: body }} />
    {!isEmpty(actions) &&
      actions.map((action) => (
        <Anchor key={action.title} onClick={action.action} color={theme.lightText}>
          {action.title}
        </Anchor>
      ))}
  </Wrapper>
);

Notification.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  actions: PropTypes.array,
  theme: PropTypes.object
};

export default withTheme(Notification);
