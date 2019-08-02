import React, { Component } from 'react';
import { Radio, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import ChoroplethTogglesStyles from './styles/ChoroplethTogglesStyles';
import { setChoropleth } from '../actions/mapActions';

const choroToggles = ['None', 'population', 'area', 'gini', 'density'];

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
    const { choropleth, sliderToggle } = this.props.map;
    const radioSize = isMobile ? 'mini' : 'small';

    return (
      <ChoroplethTogglesStyles>
        <p>Choropleth Toggles</p>
        <Form style={{ margin: '2rem' }}>
          {choroToggles.map(toggle => (
            <div className="choropanel-toggles" key={toggle}>
              <Radio
                toggle
                fitted
                size={radioSize}
                label={`${toggle[0].toUpperCase()}${toggle.slice(1)}`}
                value={toggle}
                checked={choropleth === toggle}
                onChange={this.setRadio}
              />
            </div>
          ))}
        </Form>

        {choropleth === 'population' && (
          <Radio
            slider
            fitted
            size={radioSize}
            label={`Toggle slider`}
            checked={sliderToggle}
            // onChange={}
            style={{}}
          />
        )}
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
