import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { countrySelect } from '../actions/mapActions';

class CountrySearch extends Component {
  render() {
    const { map, data, countrySelect } = this.props;
    const { currentMap, filterRegions, dimensions } = map;
    const { geographyPaths, countryMarkers } = data;
    
    let countries = geographyPaths;
    if (currentMap !== 'World') {
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

            countrySelect(geography);
          }}
        />

      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
  map: state.map,
});

export default connect(
  mapStateToProps,
  { countrySelect }
)(CountrySearch);
