import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'redux-tooltip';
import { ComposableMap, ZoomableGroup } from 'react-simple-maps';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';
import { zoomMap, tooltipMove, tooltipLeave } from './actions/mapActions';
import {
  processClickAnswer,
  loadNewInfoTab,
  toggleInfoTab,
} from './actions/quizActions';
import handleDoubleClick from './helpers/handleDoubleClick';
import handleGeographies from './helpers/handleGeographies';
import regionEllipses from './helpers/regionEllipses';
import regionLabels from './helpers/regionLabels';
import { checkIfQuizIncomplete } from './helpers/quizActionHelpers';

// Required for proper functioning of redux-tooltip
React.PropTypes = PropTypes;

class Map extends Component {
  constructor(props) {
    super(props);

    this.handleGeographies = handleGeographies.bind(this);
    this.handleDoubleClick = handleDoubleClick.bind(this);
    this.regionEllipses = regionEllipses.bind(this);
    this.regionLabels = regionLabels.bind(this);

    this._wrapper = React.createRef();
  }

  handleWheel = event => {
    if (event.deltaY > 0) {
      this.props.zoomMap(0.8);
    }
    if (event.deltaY < 0) {
      this.props.zoomMap(1.25);
    }
  };

  handleRegionClick = geographyPath => {
    if (Object.keys(geographyPath.properties).length === 0) return;
    const { isQuizActive, isTypeQuizMarked, selectedProperties } = this.props.quiz;
    const { processClickAnswer, loadNewInfoTab, toggleInfoTab } = this.props;
    if (isTypeQuizMarked && isQuizActive) return;
    const geoProperties = geographyPath.properties;
    if (checkIfQuizIncomplete()) {
      processClickAnswer(geoProperties);
    } else if (geoProperties.name !== selectedProperties.name) {
      loadNewInfoTab(geoProperties);
    } else {
      toggleInfoTab();
    }
  };

  handleMoveStart(currentCenter) {
    console.log('Current center: ', currentCenter);
  }

  handleMoveEnd(newCenter) {
    console.log('New center: ', newCenter);
  }

  setWrapperRef = wrapper => {
    this._wrapper = wrapper;
  };

  render() {
    const {
      defaultZoom,
      center,
      zoom,
      scale,
      dimensions,
      currentMap,
    } = this.props.map;

    const isUsaMap = currentMap === 'United States of America';
    const rotation = currentMap === 'Oceania' ? [170, 0, 0] : [-10, 0, 0];
    const mapProjection = isUsaMap ? 'mercator' : 'times';
    const mapScale = isUsaMap ? 180 : scale;

    return (
      <Motion
        defaultStyle={{ zoom: defaultZoom, x: center[0], y: center[1] }}
        style={{
          zoom: spring(zoom, { stiffness: 250, damping: 25 }),
          x: spring(center[0], { stiffness: 250, damping: 25 }),
          y: spring(center[1], { stiffness: 250, damping: 25 }),
        }}
      >
        {({ zoom, x, y }) => (
          <div
            onWheel={this.handleWheel}
            ref={this.setWrapperRef}
            // onDoubleClick={this.handleDoubleClick}
          >
            <ComposableMap
              projection={mapProjection}
              projectionConfig={{ scale: mapScale, rotation }}
              width={dimensions[0]}
              height={dimensions[1]}
              style={{ width: '100%', height: 'auto' }}
            >
              <ZoomableGroup
                center={[x, y]}
                zoom={zoom}
                // onMoveStart={this.handleMoveStart}
                // onMoveEnd={this.handleMoveEnd}
              >
                {this.handleGeographies()}
                {this.regionEllipses()}
                {// Condition put in place to prevent labels and markers from displaying in full map view due to poor performance
                currentMap !== 'World' && this.regionLabels()}
              </ZoomableGroup>
            </ComposableMap>
            <Tooltip />
          </div>
        )}
      </Motion>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
  map: state.map,
  quiz: state.quiz,
});

export default connect(
  mapStateToProps,
  {
    zoomMap,
    tooltipMove,
    tooltipLeave,
    processClickAnswer,
    loadNewInfoTab,
    toggleInfoTab,
  }
)(Map);
