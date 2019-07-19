import React from 'react';
import { connect } from 'react-redux';
import { choroParams } from '../helpers/choroplethFunctions';
import ChoroplethLegendStyles from './styles/ChoroplethLegendStyles';

const ChoroplethLegend = props => {
  const { choropleth } = props.map;

  if (choropleth === 'None') return null;

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

  return <ChoroplethLegendStyles>{legendsMap}</ChoroplethLegendStyles>;
};

const mapStateToProps = state => ({
  map: state.map,
});

export default connect(mapStateToProps)(ChoroplethLegend);
