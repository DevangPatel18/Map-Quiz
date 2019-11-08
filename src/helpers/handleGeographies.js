import React from 'react';
import { Geographies, Geography } from 'react-simple-maps';
import { checkRegionHide, defaultStyle } from './MapHelpers';

export default function handleGeographies() {
  const { map, data, quiz, tooltipMove, tooltipLeave } = this.props;
  const {
    orientation,
    currentMap,
    disableOptimization,
    tooltip,
    regionStyles,
  } = map;
  const { geographyPaths } = data;
  const { isQuizActive } = quiz;

  const mouseHandlers =
    !tooltip || isQuizActive
      ? {}
      : {
          onMouseMove: tooltipMove,
          onMouseLeave: tooltipLeave,
        };

  return (
    <Geographies
      geography={geographyPaths}
      disableOptimization={disableOptimization}
    >
      {(geographies, projection) =>
        geographies.map((geography, i) => {
          if (checkRegionHide(geography)) return '';
          const { regionID } = geography.properties;
          const { geoStyle, stroke } = regionStyles[regionID] || defaultStyle;
          const key = `${currentMap}-${i}-${orientation}`;
          return (
            <Geography
              key={`${key}-${i}`}
              cacheId={key}
              geography={geography}
              projection={projection}
              onClick={this.handleRegionClick}
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
  );
}
