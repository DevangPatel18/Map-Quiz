import React, { Component } from 'react';
import { Button, Radio } from 'semantic-ui-react';
import ChoroplethTogglesStyles from './styles/ChoroplethTogglesStyles';

class ChoroplethToggles extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };

    this.openDrawer = this.openDrawer.bind(this);
  }

  openDrawer() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { open } = this.state;
    return (
      <ChoroplethTogglesStyles show={open}>
        <Button
          className="drawer-button"
          icon={open ? 'toggle on' : 'toggle off'}
          circular
          toggle
          active={open}
          onClick={this.openDrawer}
          content={open ? 'Choropleth Toggles' : null}
          labelPosition={open ? 'left' : null}
        />

        <div className="choropanel">
          <h3>Choropleth Toggles</h3>
          <div className="choropanel-toggles">
            <Radio toggle label="Population" />
          </div>
        </div>
      </ChoroplethTogglesStyles>
    );
  }
}

export default ChoroplethToggles;
