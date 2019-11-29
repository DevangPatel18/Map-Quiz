import React, { Component } from 'react';
import { Radio, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { isMobile } from 'react-device-detect';
import ChoroplethTogglesStyles from './styles/ChoroplethTogglesStyles';
import { setChoropleth, sliderSet } from '../actions/mapActions';
import { worldRegions } from '../assets/mapViewSettings';

const worldToggles = ['None', 'population', 'area', 'gini', 'density'];
const subDivisionToggles = ['None', 'population', 'area', 'density'];

class ChoroplethToggles extends Component {
  constructor() {
    super();
    this.state = {};
  }

  openDrawer = () => {
    this.setState({ open: !this.state.open });
  };

  setRadio = (e, { value }) => {
    const { setChoropleth, choropleth, sliderSet } = this.props;
    if (value === choropleth) return;
    setChoropleth(value);
    if (value !== 'population') {
      sliderSet(false);
    }
  };

  render() {
    const { currentMap, sliderSet, choropleth, slider } = this.props;
    const radioSize = isMobile ? 'mini' : 'small';
    const choroToggles = worldRegions.includes(currentMap)
      ? worldToggles
      : subDivisionToggles;

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
            checked={slider}
            onChange={() => sliderSet(!slider)}
            style={{}}
          />
        )}
      </ChoroplethTogglesStyles>
    );
  }
}

const getAppState = createSelector(
  state => state.map.currentMap,
  state => state.map.choropleth,
  state => state.map.slider,
  (currentMap, choropleth, slider) => ({
    currentMap,
    choropleth,
    slider,
  })
);

export default connect(getAppState, { setChoropleth, sliderSet })(
  ChoroplethToggles
);
