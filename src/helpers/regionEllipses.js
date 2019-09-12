import React from 'react';
import { Markers, Marker } from 'react-simple-maps';
import { isMobile } from 'react-device-detect';
import { colorPicker } from './MapHelpers';
import {
  getFilterFunction,
  getEllipseMarkerProperties,
  getCaribbeanMarkerProperties,
} from './regionEllipsesHelpers'

export default function regionEllipses() {
  const { currentMap, filterRegions, tooltip } = this.props.map;
  const { isQuizActive } = this.props.quiz;
  const { geographyPaths } = this.props.data;
  const filterFunc = getFilterFunction(currentMap)
  const show = !(currentMap === 'World' && !isQuizActive);
  return show && <Markers> 
    {geographyPaths.filter(x => filterRegions.includes(x.properties.alpha3Code))
    .filter(filterFunc)
    .map((region) => {
      const { alpha3Code } = region.properties;
      const caribbeanMap = currentMap === 'Caribbean'
      const markerData = caribbeanMap
        ? getCaribbeanMarkerProperties(alpha3Code)
        : getEllipseMarkerProperties(region);

      const mouseHandlers = !tooltip || isQuizActive
        ? {}
        : {
            onMouseMove: (marker, evt) => this.props.tooltipMove(region, evt),
            onMouseLeave: this.props.tooltipLeave,
          };

      const { geoStyle } = colorPicker(region);
      return (
        <Marker
          key={alpha3Code}
          {...mouseHandlers}
          marker={markerData.marker}
          style={!caribbeanMap && geoStyle}
          preserveMarkerAspect={caribbeanMap}
        >
          {caribbeanMap && (
            <line
              x1="0"
              y1="0"
              x2={markerData.lineX.toString()}
              y2={markerData.lineY.toString()}
              stroke="black"
              strokeWidth={0.3}
            />
          )}
          {caribbeanMap ? (
            <circle
              cx={markerData.circleX}
              cy={markerData.circleY}
              r={isMobile ? 12 : 4}
              fill={geoStyle.default.fill}
              className="caribSelector"
              onClick={() => this.handleRegionClick(region)}
            />
          ) : (
            <ellipse
              fillOpacity="0.5"
              stroke="black"
              strokeWidth="0.2"
              strokeDasharray="1"
              rx={markerData.width}
              ry={markerData.height}
              transform={markerData.rotate}
              onClick={() => this.handleRegionClick(region)}
            />
          )}
        </Marker>
      );
    })}
  </Markers>
}
