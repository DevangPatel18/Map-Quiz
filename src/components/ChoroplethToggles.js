import React, { Component } from 'react';
import { Radio, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import ChoroplethTogglesStyles from './styles/ChoroplethTogglesStyles';
import { setChoropleth } from '../actions/mapActions';

const choroToggles = ['None', 'Population', 'Area', 'Gini', 'Density'];

class ChoroplethToggles extends Component {
  constructor() {
    super();
    this.state = {};

    this.openDrawer = this.openDrawer.bind(this);
    this.setRadio = this.setRadio.bind(this);
  }

  openDrawer() {
    this.setState({ open: !this.state.open });
  }

  setRadio(e, { value }) {
    const { setChoropleth } = this.props;
    setChoropleth(value);
  }

  render() {
    const { choropleth } = this.props.map;
    const radioSize = isMobile ? 'mini' : 'small';

    return (
      <ChoroplethTogglesStyles isMobile={isMobile}>
        <div className="choropanel">
          <p>Choropleth Toggles</p>
          <Form>
            {choroToggles.map(toggle => (
              <div className="choropanel-toggles" key={toggle}>
                <Radio
                  toggle
                  fitted
                  size={radioSize}
                  label={toggle}
                  value={toggle}
                  checked={choropleth === toggle}
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

const mapStateToProps = state => ({
  map: state.map,
});

export default connect(
  mapStateToProps,
  { setChoropleth }
)(ChoroplethToggles);
