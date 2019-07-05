import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

import { setNotification } from 'utils/notifications';
import Icon from 'components/common/Icon';

const Spinner = styled.div`
  border: 1px solid ${(props) => (props.color ? props.color : '#fff')};
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
  align-self: center;
  vertical-align: middle;
  display: inline-block;
  margin: 0 5px 0 0;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

class Loading extends Component {
  state = {
    online: navigator.onLine
  };

  componentDidMount() {
    window.addEventListener('online', this.setOnlineState, false);
    window.addEventListener('offline', this.setOnlineState, false);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.setOnlineState, false);
    window.removeEventListener('offline', this.setOnlineState, false);
  }

  setOnlineState = (event) => this.setState({ online: event.type === 'online' });

  render() {
    const { color, text, spinner = true, theme } = this.props;

    if (this.state.online) {
      return (
        spinner && (
          <React.Fragment>
            <Spinner color={ color }/> {text}
          </React.Fragment>
        )
      );
    }
    setNotification({
      type: 'warn',
      title: "Looks like you're offline",
      body: 'Please note, that any changes will not be saved while off-line',
      options: { autoClose: 10000 }
    });

    return (
      <React.Fragment>
        <Icon type="globe" color={ theme.colorDanger }/> {"Looks like you're off-line"}
      </React.Fragment>
    );
  }
}

Loading.propTypes = {
  color: PropTypes.string,
  text: PropTypes.string,
  spinner: PropTypes.bool,
  theme: PropTypes.object
};

export default withTheme(Loading);
