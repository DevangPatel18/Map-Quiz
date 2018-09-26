import React from 'react'
import { Marker } from 'react-simple-maps'
import { geoPath } from 'd3-geo'
import ColorPicker from "./colorPicker.js"
import { ellipseDim, labelDist } from "../helpers/markerParams"

export default function regionEllipses(countryMarkers, capitalMarkers) {
  let show = this.state.currentMap !== "world" 
  if(this.state.currentMap === "carrib") {
    return show&&this.state.geographyPaths
      .filter(x => this.state.filterRegions.includes(x.properties.alpha3Code))
      .filter(x => x.properties.area < 1000)
      .map((country, i) => {

        let alpha3Code = country.properties.alpha3Code;
        const marker = capitalMarkers.find(x => x.alpha3Code === alpha3Code);
        let dx = 20;
        let dy = -20;
        [dx, dy] = labelDist(dx, dy, alpha3Code)
        let defaultColor = ColorPicker(this.state, country)[0]

        return (
          <Marker
            key={i}
            marker={marker}
          >
            <line
              x1="0"
              y1="0"
              x2={dx.toString()}
              y2={dy.toString()}
              stroke="black"
              strokeWidth={.3}
            />
            <circle
              cx={dx/2}
              cy={dy/2}
              r={4}
              fill={defaultColor}
              className="caribSelector"
              onClick={() => {
                this.handleCountryClick(country)
              }}
            />
          </Marker>
        )
      })
  } else {
  let minArea = this.state.currentMap === "oceania" ? 29000: 6000;
  return show&&this.state.geographyPaths
    .filter(x => this.state.filterRegions.includes(x.properties.alpha3Code))
    .filter(x => x.properties.area < minArea)
    .map((country, i) => {

      const marker = countryMarkers.find(x => x.alpha3Code === country.properties.alpha3Code);
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

      width = width*this.state.zoom;
      height = height*this.state.zoom;
      let rotate = `rotate(${angle})`

      let defaultColor = ColorPicker(this.state, country)[0]

      return (
        <Marker
          key={i}
          marker={marker}
        >
          <ellipse
            fill={defaultColor}
            fillOpacity="0.5"
            stroke="black"
            strokeWidth="0.2"
            strokeDasharray="1"
            rx={width}
            ry={height}
            transform={rotate}
            onClick={() => {
              this.handleCountryClick(country)
            }}
          />
        </Marker>
      )
    })
  }
}