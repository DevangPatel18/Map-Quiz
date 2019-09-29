import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { regionZoom } from '../actions/mapActions';

const RegionSearch = ({ currentMap, regionSearchList, regionZoom }) => (
  <div className="regionSearch">
    <Dropdown
      aria-label="user country search"
      placeholder="Select Country"
      fluid
      search
      selection
      options={regionSearchList[currentMap] || []}
      onChange={regionZoom}
    />
  </div>
);

const getAppState = createSelector(
  state => state.map.currentMap,
  state => state.data.regionSearchList,
  (currentMap, regionSearchList) => ({
    currentMap,
    regionSearchList,
  })
);

export default connect(
  getAppState,
  { regionZoom }
)(RegionSearch);
