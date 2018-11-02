import React from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
} from 'react-simple-maps';
import {
  Motion,
  spring,
} from 'react-motion';
import ColorPicker from './components/colorPicker';

const doubleClick = false;

const Map = ({ appthis }) => {
  const {
    defaultZoom,
    center,
    zoom,
    scale,
    dimensions,
    geographyPaths,
    disableOptimization,
    currentMap,
  } = appthis.state;

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
          ref={wrapper => appthis._wrapper = wrapper}
          onDoubleClick={doubleClick ? appthis.handleDoubleClick : null}
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
              // onMoveStart={appthis.handleMoveStart}
              // onMoveEnd={appthis.handleMoveEnd}
            >
              <Geographies geography={geographyPaths} disableOptimization={disableOptimization}>
                {(geographies, projection) => geographies.map((geography, i) => {
                  const { defaultColor, hoverColor, pressedColor, render } = ColorPicker(appthis.state, geography);
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
                      onClick={appthis.handleCountryClick}
                      fill="white"
                      stroke="black"
                      strokeWidth={0.05}
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
              <Markers>{ appthis.regionEllipses() }</Markers>
              <Markers>{ (currentMap !== 'world') && appthis.countryLabels() }</Markers>
            </ZoomableGroup>
          </ComposableMap>
        </div>
      )}
    </Motion>
  );
};

export default Map;
