import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';

const mobileMessageStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)'
}

class MobileMessage extends Component {
  state = { visible: true }

  handleDismiss = () => {
    this.setState({ visible: false })
  }

  render() {
    if (this.state.visible) {
      return (
        <Message
          onDismiss={this.handleDismiss}
          header='Welcome to Map Quiz!'
          content="Noticed you're on a mobile device. You can move around the map using two finger panning and zoom in/out via the buttons in the top left corner."
          style={mobileMessageStyle}
          size="small"
        />
      )
    }

    return null
  }
}

export default MobileMessage;