import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';
import styled from 'styled-components';

const MessageStyle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 300;
`;

class MobileMessage extends Component {
  state = { visible: localStorage.getItem('disableMessage') ? false : true };

  handleDismiss = () => {
    this.setState({ visible: false });
    localStorage.setItem('disableMessage', '***');
  };

  render() {
    if (this.state.visible) {
      return (
        <MessageStyle>
          <Message
            onDismiss={this.handleDismiss}
            header="Welcome to Map Quiz!"
            content="Noticed you're on a mobile device. You can move around the map using two finger panning and zoom in/out via the buttons in the top left corner."
            size="small"
          />
        </MessageStyle>
      );
    }

    return null;
  }
}

export default MobileMessage;
