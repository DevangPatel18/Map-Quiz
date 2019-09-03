import React from 'react';
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
import ColorPicker from './components/colorPicker';

// Required for proper functioning of redux-tooltip
React.PropTypes = PropTypes;

const Map = props => {
  const { map, data, app, tooltipMove, tooltipLeave } = props
  const {
    defaultZoom,
    center,
    zoom,
    scale,
    dimensions,
    currentMap,
    disableOptimization,
    tooltip,
  } = map;

  const isUsaMap = currentMap === 'United States of America'

  const { geographyPaths } = data

  const { isQuizActive } = props.quiz;

  const mouseHandlers = !tooltip || isQuizActive
    ? {}
    : {
        onMouseMove: tooltipMove,
        onMouseLeave: tooltipLeave,
      };
    
  const rotation = currentMap === 'Oceania' ? [170, 0, 0] : [-10, 0, 0];
  const mapProjection = isUsaMap ? 'mercator' : 'times';
  const mapScale = isUsaMap ? 180 : scale;

  return (
    <Motion
      defaultStyle={{
        zoom: defaultZoom,
        x: center[0],
        y: center[1],
      }}
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
            style={{
              width: '100%',
              height: 'auto',
            }}
          >
            <ZoomableGroup
              center={[x, y]}
              zoom={zoom}
              // onMoveStart={app.handleMoveStart}
              // onMoveEnd={app.handleMoveEnd}
            >
              <Geographies geography={geographyPaths} disableOptimization={disableOptimization}>
                {(geographies, projection) => geographies.map((geography, i) => {
                  const {
                    defaultColor,
                    hoverColor,
                    pressedColor,
                    render,
                    strokeWidth,
                    strokeColor,
                  } = ColorPicker(geography);
                  let orientation;
                  switch (dimensions[0]) {
                    case 980:
                      orientation = 'landscape';
                      break;
                    case 645:
                      orientation = 'medium';
                      break;
                    case 420:
                      orientation = 'small';
                      break;
                    case 310:
                      orientation = 'portrait';
                      break;
                    default:
                  }
                  let key; let cacheId;
                  if (currentMap === 'Oceania') {
                    key = `oceania-${i}-${orientation}`;
                    cacheId = `oceania-${i}-${orientation}`;
                  } else if (currentMap === 'United States of America') {
                    key = `usa-${i}-${orientation}`;
                    cacheId = `usa-${i}-${orientation}`;
                  } else {
                    key = `geography-${i}-${orientation}`;
                    cacheId = `geography-${i}-${orientation}`;
                  }
                  return render && (
                    <Geography
                      key={key}
                      cacheId={cacheId}
                      geography={geography}
                      projection={projection}
                      onClick={app.handleRegionClick}
                      {...mouseHandlers}
                      fill="white"
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      style={{
                        default: {
                          fill: defaultColor,
                          transition: 'fill .5s',
                        },
                        hover: {
                          fill: hoverColor,
                          transition: 'fill .5s',
                        },
                        pressed: {
                          fill: pressedColor,
                          transition: 'fill .5s',
                        },
                      }}
                    />
                  );
                })}
              </Geographies>
              {app.regionEllipses()}
              {
                // Condition put in place to prevent labels and markers from displaying in full map view due to poor performance
                (currentMap !== 'World') && app.regionLabels()
              }
            </ZoomableGroup>
          </ComposableMap>
          <Tooltip />
        </div>
      )}
    </Motion>
  );
};

const mapStateToProps = state => ({
  data: state.data,
  map: state.map,
  quiz: state.quiz,
})

export default connect(
  mapStateToProps,
  { tooltipMove, tooltipLeave }
)(Map);
