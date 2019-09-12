import React from 'react';
import { Markers, Marker } from 'react-simple-maps';
import { geoPath } from 'd3-geo';
import { isMobile } from 'react-device-detect';
import { colorPicker } from './MapHelpers';
import { ellipseDim } from './markerParams';
import projection from "./projection";
import { getFilterFunction, getCaribMarkerProperties } from './regionEllipsesHelpers'

const caribUN = ['ATG', 'BRB', 'DMA', 'GRD', 'KNA', 'LCA', 'VCT'];

export default function regionEllipses() {
  const { currentMap, filterRegions, tooltip } = this.props.map;
  const { isQuizActive } = this.props.quiz;
  const { geographyPaths, regionMarkers } = this.props.data;
  const filterFunc = getFilterFunction(currentMap)
  const show = !(currentMap === 'World' && !isQuizActive);
  return show && <Markers> 
    {geographyPaths.filter(x => filterRegions.includes(x.properties.alpha3Code))
    .filter(filterFunc)
    .map((region) => {
      let marker; let rotate; let widthMain; let heightMain; let angleMain;
      const { alpha3Code } = region.properties;
      const caribbeanMap = currentMap === 'Caribbean'
      let markerData
      if (caribbeanMap) {
        markerData = getCaribMarkerProperties(alpha3Code);
        marker = markerData.marker
      } else {
        marker = regionMarkers.find(x => x.alpha3Code === alpha3Code);
        const path = geoPath().projection(projection());
        if (Object.keys(ellipseDim).includes(alpha3Code)) {
          const { width, height, angle } = ellipseDim[alpha3Code];
          widthMain = width;
          heightMain = height;
          angleMain = angle;
        } else {
          const bounds = path.bounds(region);
          const originWidth = bounds[1][0] - bounds[0][0];
          const originHeight = bounds[1][1] - bounds[0][1];
          
          const radius = caribUN.includes(alpha3Code) ? 1.5 : 3;
          
          widthMain = Math.max(originWidth, radius);
          heightMain = Math.max(originHeight, radius);

          angleMain = 0;
        }

        rotate = `rotate(${angleMain})`;
      }

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
          marker={marker}
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
              rx={widthMain}
              ry={heightMain}
              transform={rotate}
              onClick={() => this.handleRegionClick(region)}
            />
          )}
        </Marker>
      );
    })}
  </Markers>
}
