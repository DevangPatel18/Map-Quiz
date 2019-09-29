import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Button } from 'semantic-ui-react';
import { zoomMap, recenterMap } from '../actions/mapActions';

const ZoomButtons = ({ zoomFactor, zoomMap, recenterMap }) => (
  <div className="zoomButtons">
    <Button.Group size="tiny" vertical>
      <Button
        onClick={() => zoomMap(zoomFactor)}
        icon="plus"
        inverted
        aria-label="map zoom in"
      />
      <Button
        onClick={() => zoomMap(1 / zoomFactor)}
        icon="minus"
        inverted
        aria-label="map zoom out"
      />
      <Button
        onClick={recenterMap}
        icon="undo"
        inverted
        aria-label="map zoom reset"
      />
    </Button.Group>
  </div>
);

const getAppState = createSelector(
  state => state.map.zoomFactor,
  zoomFactor => ({
    zoomFactor,
  })
);

export default connect(
  getAppState,
  {
    zoomMap,
    recenterMap,
  }
)(ZoomButtons);
