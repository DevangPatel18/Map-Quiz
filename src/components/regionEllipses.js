import React from 'react';
import { Marker } from 'react-simple-maps';
import { geoPath } from 'd3-geo';
import ColorPicker from './colorPicker';
import { ellipseDim, labelDist } from '../helpers/markerParams';

export default function regionEllipses() {
  const {
    currentMap, geographyPaths, filterRegions, capitalMarkers, countryMarkers, zoom,
  } = this.state;
  let minArea;
  switch (currentMap) {
    case 'carrib':
      minArea = 2000;
      break;
    case 'oceania':
      minArea = 29000;
      break;
    default:
      minArea = 6000;
  }

  const show = currentMap !== 'world';
  return show && geographyPaths
    .filter(x => filterRegions.includes(x.properties.alpha3Code))
    .filter(x => x.properties.area < minArea)
    .map((country) => {
      let marker; let dx; let dy; let rotate; let widthMain; let heightMain; let angleMain;
      const { alpha3Code } = country.properties;
      if (currentMap === 'carrib') {
        marker = capitalMarkers.find(x => x.alpha3Code === alpha3Code);
        dx = 20;
        dy = -20;
        [dx, dy] = labelDist(dx, dy, alpha3Code);
      } else {
        marker = countryMarkers.find(x => x.alpha3Code === alpha3Code);
        const path = geoPath().projection(this.projection());
        if (Object.keys(ellipseDim).includes(alpha3Code)) {
          const { width, height, angle } = ellipseDim[alpha3Code];
          widthMain = width;
          heightMain = height;
          angleMain = angle;
        } else {
          const bounds = path.bounds(country);
          const originWidth = bounds[1][0] - bounds[0][0];
          const originHeight = bounds[1][1] - bounds[0][1];
          widthMain = Math.max(originWidth, 3);
          heightMain = Math.max(originHeight, 3);
          angleMain = 0;
        }

        widthMain *= zoom;
        heightMain *= zoom;
        rotate = `rotate(${angleMain})`;
      }
      const [defaultColor, hoverColor] = ColorPicker(this.state, country);
      return (
        <Marker
          key={alpha3Code}
          marker={marker}
          style={currentMap !== 'carrib' ? {
            default: {
              fill: defaultColor,
              transition: 'fill .5s',
            },
            hover: {
              fill: hoverColor,
              transition: 'fill .5s',
            },
            pressed: {
              fill: 'rgb(105, 105, 105)',
              transition: 'fill .5s',
            },
          } : ''}
        >
          {currentMap === 'carrib' ? (
            <line
              x1="0"
              y1="0"
              x2={dx.toString()}
              y2={dy.toString()}
              stroke="black"
              strokeWidth={0.3}
            />
          ) : ''}
          {currentMap === 'carrib' ? (
            <circle
              cx={dx / 2}
              cy={dy / 2}
              r={4}
              fill={defaultColor}
              className="caribSelector"
              onClick={() => { this.handleCountryClick(country); }}
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
              onClick={() => { this.handleCountryClick(country); }}
            />
          )}
        </Marker>
      );
    });
}
