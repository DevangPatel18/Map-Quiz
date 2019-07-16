import React, { Component } from 'react';
import { Button, Radio, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { choroParams } from '../helpers/choroplethFunctions';
import { isMobile } from 'react-device-detect';
import ChoroplethTogglesStyles from './styles/ChoroplethTogglesStyles';
import { setChoropleth } from '../actions/mapActions';

const choroToggles = ['None', 'Population', 'Area', 'Gini', 'Density'];

class ChoroplethToggles extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };

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

  createLegend() {
    const { choropleth } = this.props.map;
    const { scaleFunc, bounds, units } = choroParams[choropleth];
    let legendsMap;
    const grouped = bounds.length > 2;

    if (grouped) {
      legendsMap = bounds;
    } else {
      const bound = (bounds[1] - bounds[0]) / 10;
      legendsMap = [bounds[0]];
      for (let i = 0; i < 10; i++) {
        legendsMap.push(legendsMap[i] + bound);
      }
    }

    legendsMap = legendsMap.map((x, i) => (
      <div key={x} className="legendItem">
        <div
          className="legendColor"
          style={{ background: `${scaleFunc(grouped ? i : x)}` }}
        />
        {x.toLocaleString()}
      </div>
    ));

    legendsMap.unshift(
      <div key={choropleth} className="legendTitle">
        {choropleth}
        {units ? ` - ${units}` : ''}
      </div>
    );
    return legendsMap;
  }

  render() {
    const { open } = this.state;
    const { choropleth } = this.props.map;
    let legend;
    if (choropleth !== 'None') {
      legend = this.createLegend();
    }
    const radioSize = isMobile ? 'mini' : 'small';

    return (
      <ChoroplethTogglesStyles show={open} isMobile={isMobile}>
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

        {choropleth !== 'None' && <div className="chorolegend">{legend}</div>}
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
