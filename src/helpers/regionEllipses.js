import React from 'react';
import { Markers, Marker } from 'react-simple-maps';
import { colorPicker } from './MapHelpers';

export default function regionEllipses() {
  const { currentMap, tooltip } = this.props.map;
  const { isQuizActive } = this.props.quiz;
  const { regionEllipsesData } = this.props.data;
  const currentMapEllipses = regionEllipsesData[currentMap]
  const show = !(currentMap === 'World' && !isQuizActive) && currentMapEllipses;
  return show && <Markers> 
    {currentMapEllipses
    .map((markerData) => {
      const { region } = markerData
      const { alpha3Code } = region.properties;
      const caribbeanMap = currentMap === 'Caribbean'

      const mouseHandlers = !tooltip || isQuizActive
        ? {}
        : {
            onMouseMove: (marker, evt) => this.props.tooltipMove(region, evt),
            onMouseLeave: this.props.tooltipLeave,
          };

      const { geoStyle } = colorPicker(region);
      const circleFill =
        geoStyle.default.fill === 'rgb(0, 140, 0)'
         ? "rgba(255,255,255,0.5)"
         : geoStyle.default.fill

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
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="4"
            />
          )}
          {caribbeanMap ? (
            <circle
              cx={markerData.circleX}
              cy={markerData.circleY}
              r="10"
              fill={circleFill}
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
