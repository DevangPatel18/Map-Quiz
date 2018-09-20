import React from 'react'
import { Marker } from 'react-simple-maps'

export default function countryLabels(countryMarkers, capitalMarkers) {
  return this.state.quiz ? this.state.quizGuesses.map((gss, i) => {
    if(gss){
      if(this.state.quizType === "name" || this.state.quizType === "flag" ) {
        var marker = countryMarkers.find(x => x.alpha3Code === this.state.quizAnswers[i]);
      } else if (this.state.quizType === "capital") {
        marker = capitalMarkers.find(x => x.alpha3Code === this.state.quizAnswers[i]);
      }
    }
    return gss&&(
      <Marker
        key={i}
        marker={marker}
        style={{
          default: { fill: "#FF5722" },
          hover: { fill: "#FFFFFF" },
          pressed: { fill: "#FF5722" },
        }}
      >
        {this.state.quizType === "capital" ? 
          (<circle
            cx={0}
            cy={0}
            r={2}
            className="dropFade"
            style={{
              stroke: "#FF5722",
              strokeWidth: 3,
              opacity: 0.9,
            }}
          />):null
        }
        <text
          textAnchor="middle"
          y={marker.markerOffset}
          className="mapLabel dropFade"
        >
          {marker.name}
        </text>
      </Marker>
    )}
  ):null
}