import React from 'react';
import { Markers, Marker } from 'react-simple-maps';
import { geoPath } from 'd3-geo';
import { isMobile } from 'react-device-detect';
import ColorPicker from './MapHelpers';
import { ellipseDim, labelDist, labelist } from './markerParams';
import projection from "./projection";

const oceaniaUN = ['PLW', 'FSM', 'MHL', 'KIR', 'NRU', 'SLB', 'NCL', 'VUT', 'FJI', 'TUV', 'TON', 'WSM'];
const caribUN = ['ATG', 'BRB', 'DMA', 'GRD', 'KNA', 'LCA', 'VCT'];

export default function regionEllipses() {
  const { currentMap, filterRegions, tooltip } = this.props.map;
  const { isQuizActive } = this.props.quiz;
  const { geographyPaths, capitalMarkers, regionMarkers } = this.props.data;
  let minArea;
  switch (currentMap) {
    case 'Caribbean':
      minArea = 2000;
      break;
    case 'Oceania':
      minArea = 29000;
      break;
    default:
      minArea = 6000;
  }

  let filterFN;

  if (currentMap !== 'World') {
    filterFN = x => x.properties.area < minArea;
  } else {
    filterFN = x => x.properties.area < minArea || oceaniaUN.includes(x.properties.alpha3Code);
  }

  const show = !(currentMap === 'World' && !isQuizActive);
  return show && <Markers> 
    {geographyPaths.filter(x => filterRegions.includes(x.properties.alpha3Code))
    .filter(filterFN)
    .map((region) => {
      let marker; let dx; let dy; let rotate; let widthMain; let heightMain; let angleMain;
      let ccx;
      let ccy;
      let llx;
      let lly;
      const { alpha3Code } = region.properties;
      const caribbeanMap = currentMap === 'Caribbean'
      if (caribbeanMap) {
        marker = capitalMarkers.find(x => x.alpha3Code === alpha3Code);
        dx = 20;
        dy = -20;
        [dx, dy] = labelDist(dx, dy, alpha3Code);
        ccx = dx;
        ccy = dy;
        llx = dx;
        lly = dy;

        if(!labelist.includes(alpha3Code)) {
          ccx = dx*.8
          ccy = dy*.8
          llx = dx*.65
          lly = dy*.65
        } else {
          ccx = dx*.93
          ccy = dy*.93
          llx = dx*.88
          lly = dy*.88
        }

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

      const { defaultColor, hoverColor, pressedColor } = ColorPicker(region);
      return (
        <Marker
          key={alpha3Code}
          {...mouseHandlers}
          marker={marker}
          style={!caribbeanMap && {
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
          preserveMarkerAspect={caribbeanMap}
        >
          {caribbeanMap && (
            <line
              x1="0"
              y1="0"
              x2={llx.toString()}
              y2={lly.toString()}
              stroke="black"
              strokeWidth={0.3}
            />
          )}
          {caribbeanMap ? (
            <circle
              cx={ccx}
              cy={ccy}
              r={isMobile ? 12 : 4}
              fill={defaultColor}
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
