import React from 'react';
import { Markers, Marker } from 'react-simple-maps';

export default function regionEllipses() {
  const { currentMap, tooltip, regionStyles } = this.props.map;
  const { isQuizActive } = this.props.quiz;
  const { regionEllipsesData } = this.props.data;
  const currentMapEllipses = regionEllipsesData[currentMap]
  const show = !(currentMap === 'World' && !isQuizActive) && currentMapEllipses;
  return show && <Markers> 
    {currentMapEllipses
    .map((markerData, i) => {
      const { region } = markerData
      const { properties } = region
      const { regionID } = properties
      const caribbeanMap = currentMap === 'Caribbean'

      if(!regionID || !regionStyles[regionID]) return '';

      const mouseHandlers = !tooltip || isQuizActive
        ? {}
        : {
            onMouseMove: (marker, evt) => this.props.tooltipMove(region, evt),
            onMouseLeave: this.props.tooltipLeave,
          };

      const { geoStyle } = regionStyles[regionID];
      const circleFill =
        geoStyle.default.fill === 'rgb(0, 140, 0)'
         ? "rgba(255,255,255,0.5)"
         : geoStyle.default.fill
      const updatedMarker = { ...markerData.marker, properties }

      return (
        <Marker
          key={`${regionID}-${i}`}
          {...mouseHandlers}
          marker={updatedMarker}
          style={!caribbeanMap && geoStyle}
          preserveMarkerAspect={caribbeanMap}
          onClick={this.handleRegionClick}
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
            />
          ) : (
            <ellipse
              fillOpacity="0.5"
              stroke="black"
              strokeWidth="0.05"
              strokeDasharray="0.5"
              rx={markerData.width}
              ry={markerData.height}
              transform={markerData.rotate}
            />
          )}
        </Marker>
      );
    })}
  </Markers>
}
