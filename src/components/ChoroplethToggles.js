import React, { Component } from 'react';
import { Button, Radio, Form } from 'semantic-ui-react';
import { choroParams } from '../helpers/choroplethFunctions';
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

  createLegend() {
    const { checkedChoropleth } = this.state;
    const { scaleFunc, bounds, units } = choroParams[checkedChoropleth];
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
      <div key={checkedChoropleth} className="legendTitle">
        {checkedChoropleth}
        {units ? ` - ${units}` : ''}
      </div>
    );
    return legendsMap;
  }

  render() {
    const { open, checkedChoropleth } = this.state;
    let legend;
    if (checkedChoropleth !== 'None') {
      legend = this.createLegend();
    }

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

        {checkedChoropleth !== 'None' && (
          <div className="chorolegend">{legend}</div>
        )}
      </ChoroplethTogglesStyles>
    );
  }
}

export default ChoroplethToggles;
