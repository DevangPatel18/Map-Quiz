import React from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
} from 'react-simple-maps';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';
import ColorPicker from './components/colorPicker';
import RegionEllipses from './components/regionEllipses'
import CountryLabels from './components/countryLabels'

const doubleClick = false;

const Map = ({ props }) => {
  const {
    defaultZoom,
    center,
    zoom,
    scale,
    dimensions,
    currentMap,
  } = props.state;

  const { geographyPaths } = props.props.data
  const { disableOptimization } = props.props.map

  const rotation = currentMap === 'Oceania' ? [170, 0, 0] : [-10, 0, 0];
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
          ref={wrapper => props._wrapper = wrapper}
          onDoubleClick={doubleClick ? props.handleDoubleClick : null}
        >
          <ComposableMap
            projectionConfig={{ scale, rotation }}
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
              // onMoveStart={props.handleMoveStart}
              // onMoveEnd={props.handleMoveEnd}
            >
              <Geographies geography={geographyPaths} disableOptimization={disableOptimization}>
                {(geographies, projection) => geographies.map((geography, i) => {
                  const { defaultColor, hoverColor, pressedColor, render, strokeWidth } = ColorPicker(props.state, geography);
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
                      onClick={props.handleCountryClick}
                      fill="white"
                      stroke="black"
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
              <Markers><RegionEllipses props={props}/></Markers>
              <Markers>
              {
                // Condition put in place to prevent labels and markers from displaying in full map view due to poor performance
                (currentMap !== 'world') && <CountryLabels props={props} />
              }
              </Markers>
            </ZoomableGroup>
          </ComposableMap>
        </div>
      )}
    </Motion>
  );
};

const mapStateToProps = state => ({
  data: state.data,
  map: state.map
})

export default connect(mapStateToProps)(Map);
