import React from 'react'
import { Marker } from 'react-simple-maps'
import { geoPath } from 'd3-geo'
import ColorPicker from "./colorPicker.js"
import { ellipseDim, labelDist } from "../helpers/markerParams"

export default function regionEllipses() {
  let { currentMap, geographyPaths, filterRegions, capitalMarkers, countryMarkers, zoom } = this.state
  let minArea = currentMap === "carrib" ? 2000 : currentMap === "oceania" ? 29000: 6000;
  let show = currentMap !== "world" 
  return show&&geographyPaths
    .filter(x => filterRegions.includes(x.properties.alpha3Code))
    .filter(x => x.properties.area < minArea)
    .map((country, i) => {

      if(currentMap === "carrib") {
        let alpha3Code = country.properties.alpha3Code;
        var marker = capitalMarkers.find(x => x.alpha3Code === alpha3Code);
        var dx = 20;
        var dy = -20;
        [dx, dy] = labelDist(dx, dy, alpha3Code);
      } else {
        marker = countryMarkers.find(x => x.alpha3Code === country.properties.alpha3Code);
        const path = geoPath().projection(this.projection())

        if(Object.keys(ellipseDim).includes(country.properties.alpha3Code)){
          var { width, height, angle } = ellipseDim[country.properties.alpha3Code]
        } else {
          const bounds = path.bounds(country)
          const originWidth = bounds[1][0] - bounds[0][0];
          const originHeight = bounds[1][1] - bounds[0][1];
          width = Math.max(originWidth, 3);
          height = Math.max(originHeight, 3);
          angle = 0
        }

        width = width*zoom;
        height = height*zoom;
        var rotate = `rotate(${angle})`
      }
      let [defaultColor, hoverColor] = ColorPicker(this.state, country)
      return (
        <Marker
          key={i}
          marker={marker}
          style={currentMap !== "carrib" ? {
            default: {
              fill : defaultColor,
              transition: "fill .5s",
            },
            hover:   {
              fill : hoverColor,
              transition: "fill .5s",
            },
            pressed: {
              fill : "rgb(105, 105, 105)",
              transition: "fill .5s"
            },
          }:""}
        >
          {currentMap === "carrib" ? (
            <line
              x1="0"
              y1="0"
              x2={dx.toString()}
              y2={dy.toString()}
              stroke="black"
              strokeWidth={.3}
            />
          ):""}
          {currentMap === "carrib" ? (
            <circle
              cx={dx/2}
              cy={dy/2}
              r={4}
              fill={defaultColor}
              className="caribSelector"
              onClick={() => { this.handleCountryClick(country) }}
            />
          ):(
            <ellipse
              fillOpacity="0.5"
              stroke="black"
              strokeWidth="0.2"
              strokeDasharray="1"
              rx={width}
              ry={height}
              transform={rotate}
              onClick={() => { this.handleCountryClick(country) }}
            />
          )}
        </Marker>
      )
    })
}