import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { geoPath } from 'd3-geo';

export default class CountrySearch extends Component {
  render() {
    const { projection, state, mapRefresh } = this.props;
    const {
      geographyPaths, currentMap, filterRegions, countryMarkers, dimensions,
    } = state;
    let countries = geographyPaths;
    if (currentMap !== 'world') {
      countries = countries.filter(x => filterRegions.includes(x.properties.alpha3Code));
    }

    countries = countries
      .map((x) => {
        if (!x.properties.alpha2Code) { return null; }
        const y = x.properties.alpha2Code.toString().toLowerCase();
        return {
          key: y, flag: y, text: x.properties.name, value: x.properties.alpha3Code,
        };
      })
      .filter(x => x !== null)
      .filter(x => !['bl', 'cw', 'gg', 'im', 'je', 'mf', 'ss', 'sx', 'bq', 'ko'].includes(x.key))
      .sort((a, b) => (a.text > b.text ? 1 : -1));

    return (
      <div className="countrySearch">
        <Dropdown
          placeholder="Select Country"
          fluid
          search
          selection
          options={countries}
          onChange={(e, d) => {
            let geography;
            if (e.code === 'Enter') {
              geography = geographyPaths
                .find(x => x.properties.alpha3Code === d.value);
            } else {
              geography = geographyPaths
                .find(x => x.properties.name === e.target.innerText);
            }

            if (!geography) { return; }

            const selectedProperties = geography.properties;

            const center = countryMarkers
              .find(x => x.alpha3Code === selectedProperties.alpha3Code)
              .coordinates;

            const path = geoPath().projection(projection());
            const bounds = path.bounds(geography);
            const width = bounds[1][0] - bounds[0][0];
            const height = bounds[1][1] - bounds[0][1];
            let zoom = 0.7 / Math.max(width / dimensions[0], height / dimensions[1]);

            zoom = selectedProperties.alpha3Code === 'USA' ? zoom * 6 : zoom;

            zoom = Math.min(zoom, 64);

            mapRefresh({
              selectedProperties, center, zoom, viewInfoDiv: true,
            });
          }}
        />

      </div>
    );
  }
}
