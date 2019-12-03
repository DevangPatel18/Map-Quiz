import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { choroParams, numShorten } from '../helpers/choroplethFunctions';
import ChoroplethLegendStyles from './styles/ChoroplethLegendStyles';
import {
  highlightRegions,
  deselectRegions,
} from '../actions/mapActions';

const ChoroplethLegend = props => {
  const {
    choropleth,
    currentMap,
    choroplethParams,
    highlightRegions,
    deselectRegions,
  } = props;

  if (choropleth === 'None') return null;

  const { units } = choroParams[choropleth];
  const { bounds } = choroplethParams[currentMap][choropleth];

  const legendsMap = bounds.map(({ lower, upper, color }) => (
    <div key={color} className="legendItem">
      <div
        className="legendColor"
        style={{ background: `${color}` }}
        id={color}
        onMouseEnter={highlightRegions}
        onMouseLeave={deselectRegions}
      />
      {numShorten(lower)} - {numShorten(upper)}
    </div>
  ));

  legendsMap.unshift(
    <div key={choropleth} className="legendTitle">
      {choropleth}
      {units ? ` - ${units}` : ''}
    </div>
  );

  return <ChoroplethLegendStyles>{legendsMap}</ChoroplethLegendStyles>;
};

const getAppState = createSelector(
  state => state.map.choropleth,
  state => state.map.currentMap,
  state => state.data.choroplethParams,
  (choropleth, currentMap, choroplethParams) => ({
    choropleth,
    currentMap,
    choroplethParams,
  })
);

export default connect(getAppState, {
  highlightRegions,
  deselectRegions,
})(ChoroplethLegend);
