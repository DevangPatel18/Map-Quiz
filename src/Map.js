import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'redux-tooltip';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';
import { tooltipMove, tooltipLeave } from './actions/mapActions';
import { colorPicker, checkRegionHide } from './helpers/MapHelpers';

// Required for proper functioning of redux-tooltip
React.PropTypes = PropTypes;

class Map extends Component {
  render() {
    const { map, data, quiz, app, tooltipMove, tooltipLeave } = this.props;
    const {
      defaultZoom,
      center,
      zoom,
      scale,
      dimensions,
      orientation,
      currentMap,
      disableOptimization,
      tooltip,
    } = map;
    const { isQuizActive } = quiz;
    const { geographyPaths } = data;

    const isUsaMap = currentMap === 'United States of America';
    const rotation = currentMap === 'Oceania' ? [170, 0, 0] : [-10, 0, 0];
    const mapProjection = isUsaMap ? 'mercator' : 'times';
    const mapScale = isUsaMap ? 180 : scale;
    const mouseHandlers =
      !tooltip || isQuizActive
        ? {}
        : {
            onMouseMove: tooltipMove,
            onMouseLeave: tooltipLeave,
          };

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
            onWheel={app.handleWheel}
            // onDoubleClick={app.handleDoubleClick}
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
                // onMoveStart={app.handleMoveStart}
                // onMoveEnd={app.handleMoveEnd}
              >
                <Geographies
                  geography={geographyPaths}
                  disableOptimization={disableOptimization}
                >
                  {(geographies, projection) =>
                    geographies.map((geography, i) => {
                      if (checkRegionHide(geography)) return '';
                      const { geoStyle, stroke } = colorPicker(geography);
                      const key = `${currentMap}-${i}-${orientation}`;
                      return (
                        <Geography
                          key={key}
                          cacheId={key}
                          geography={geography}
                          projection={projection}
                          onClick={app.handleRegionClick}
                          {...mouseHandlers}
                          fill="white"
                          stroke={stroke.strokeColor}
                          strokeWidth={stroke.strokeWidth}
                          style={geoStyle}
                        />
                      );
                    })
                  }
                </Geographies>
                {app.regionEllipses()}
                {// Condition put in place to prevent labels and markers from displaying in full map view due to poor performance
                currentMap !== 'World' && app.regionLabels()}
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
  { tooltipMove, tooltipLeave }
)(Map);
