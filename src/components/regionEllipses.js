import React from 'react'
import { Marker } from 'react-simple-maps'
import { geoPath } from 'd3-geo'
import ColorPicker from "./colorPicker.js"

const ellipseDim = {
  "FJI": {width: 13, height: 18, angle: 0 },
  "KIR": { width: 30, height: 20, angle: 0 },
  "MHL": { width: 11, height: 13, angle: 0 },
  "FSM": { width: 37, height: 9, angle: 10 },
  "MNP": { width: 2, height: 8, angle: 0 }, 
  "SLB": { width: 18, height: 8, angle: 27 },
  "VUT": { width: 5, height: 11.5, angle: -14 },
  "NCL": { width: 12, height: 10, angle: 0 },
  "TON": { width: 3, height: 9, angle: 20 }, 
}

export default function regionEllipses(countryMarkers) {
  let show = this.state.currentMap !== "world" && this.state.currentMap !== "carrib"
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