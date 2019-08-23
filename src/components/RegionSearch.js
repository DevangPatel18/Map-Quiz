import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { regionZoom } from '../actions/mapActions';

const RegionSearch = ({ map, data, regionZoom }) => {
  const { currentMap, filterRegions } = map;
  const { geographyPaths } = data;

  let mapRegions = geographyPaths;
  const regionKey =
    geographyPaths && geographyPaths[0] && geographyPaths[0].properties.regionID
      ? 'regionID'
      : 'alpha3Code';
  if (currentMap !== 'World') {
    mapRegions = mapRegions.filter(x =>
      filterRegions.includes(x.properties[regionKey])
    );
  }

  mapRegions = mapRegions
    .map(x => {
      let key;
      let flag;
      if (regionKey === 'alpha3Code') {
        if (!x.properties.alpha2Code) {
          return null;
        }
        key = x.properties.alpha2Code.toString().toLowerCase();
        flag = { flag: key };
      } else {
        key = x.properties[regionKey];
      }

      return {
        key,
        ...flag,
        text: x.properties.name,
        value: x.properties[regionKey],
      };
    })
    .filter(x => x !== null)
    .filter(
      x =>
        !['bl', 'cw', 'gg', 'im', 'je', 'mf', 'ss', 'sx', 'bq', 'ko'].includes(x.key)
    )
    .sort((a, b) => (a.text > b.text ? 1 : -1));

  return (
    <div className="regionSearch">
      <Dropdown
        aria-label="user country search"
        placeholder="Select Country"
        fluid
        search
        selection
        options={mapRegions}
        onChange={(e, d) => {
          let geography;
          if (e.code === 'Enter') {
            geography = geographyPaths.find(
              x => x.properties[regionKey] === d.value
            );
          } else {
            geography = geographyPaths.find(
              x => x.properties.name === e.target.innerText
            );
          }

          if (!geography) {
            return;
          }

          regionZoom(geography);
        }}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  data: state.data,
  map: state.map,
});

export default connect(
  mapStateToProps,
  { regionZoom }
)(RegionSearch);
