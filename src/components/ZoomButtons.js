import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { zoomMap, recenterMap } from '../actions/mapActions';

const ZoomButtons = ({ map, zoomMap, recenterMap }) => (
  <div className="zoomButtons">
    <Button.Group size="tiny" vertical>
      <Button
        onClick={() => zoomMap(map.zoomFactor)}
        icon="plus"
        inverted
        aria-label="map zoom in"
      />
      <Button
        onClick={() => zoomMap(1 / map.zoomFactor)}
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

const mapStateToProps = state => ({
  map: state.map,
});

export default connect(
  mapStateToProps,
  {
    zoomMap,
    recenterMap,
  }
)(ZoomButtons);
