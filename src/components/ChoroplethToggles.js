import React, { Component } from 'react';
import { Button, Radio, Form } from 'semantic-ui-react';
import ChoroplethTogglesStyles from './styles/ChoroplethTogglesStyles';

const choroToggles = ['None', 'Population', 'Area', 'Gini', 'Density'];

class ChoroplethToggles extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      checkedChoropleth: 'None',
    };

    this.openDrawer = this.openDrawer.bind(this);
    this.setRadio = this.setRadio.bind(this);
  }

  openDrawer() {
    this.setState({ open: !this.state.open });
  }

  setRadio(e, { value }) {
    const { setChoropleth } = this.props;
    this.setState({ checkedChoropleth: value });
    setChoropleth(value);
  }

  render() {
    const { open, checkedChoropleth } = this.state;
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
          <Form>
            {choroToggles.map(toggle => (
              <div className="choropanel-toggles" key={toggle}>
                <Radio
                  toggle
                  label={toggle}
                  value={toggle}
                  checked={checkedChoropleth === toggle}
                  onChange={this.setRadio}
                />
              </div>
            ))}
          </Form>
        </div>
      </ChoroplethTogglesStyles>
    );
  }
}

export default ChoroplethToggles;
