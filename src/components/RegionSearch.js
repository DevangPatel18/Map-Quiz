import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { regionZoom } from '../actions/mapActions';

const RegionSearch = ({ map, data, regionZoom }) => {
  const { currentMap, filterRegions, regionKey } = map;
  const { geographyPaths } = data;

  let mapRegions = geographyPaths;
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
        onChange={regionZoom}
      />
    </div>
  );
};

const getAppState = createSelector(
  state => state.map.currentMap,
  state => state.map.filterRegions,
  state => state.map.regionKey,
  state => state.data.geographyPaths,
  (currentMap, filterRegions, regionKey, geographyPaths) => ({
    map: { currentMap, filterRegions, regionKey },
    data: { geographyPaths },
  })
);

export default connect(
  getAppState,
  { regionZoom }
)(RegionSearch);
