import React from 'react';
import { Markers, Marker } from 'react-simple-maps';
import { labelDist, tinyCarib, labelAnchors } from '../helpers/markerParams';

export default function countryLabels() {
  const {
    quiz,
    quizGuesses,
    quizType,
    quizAnswers,
    markerToggle,
  } = this.props.quiz;
  const { countryMarkers, capitalMarkers } = this.props.data;
  const { currentMap, filterRegions } = this.props.map;

  let display = true;
  let markerArray;
  let testing;
  if (quiz) {
    markerArray = quizAnswers;
    testing = quizType.split('_')[1];
  } else if (markerToggle !== '') {
    markerArray = filterRegions;
    testing = markerToggle;
  } else {
    display = false;
  }
  return display && <Markers>
    {markerArray.map((alpha3Code, i) => {
      let marker;
      let markerName;
      let textAnchor;
      let dx;
      let dy;
      const markerDisplay = quiz ? quizGuesses[i] : true;
      if (markerDisplay) {
        if (testing === 'name' || testing === 'flag') {
          marker = countryMarkers.find(x => x.alpha3Code === alpha3Code);
        } else if (testing === 'capital') {
          marker = capitalMarkers.find(x => x.alpha3Code === alpha3Code);
        }
        markerName = marker.name;
        textAnchor = 'middle';
        dx = 0;
        dy = marker ? marker.markerOffset : 0;

        if (currentMap === 'Caribbean') {
          if (tinyCarib.includes(alpha3Code)) {
            marker =
              testing !== 'capital'
                ? capitalMarkers.find(x => x.alpha3Code === alpha3Code)
                : marker;
            dx = 20;
            dy = -20;
            [dx, dy, textAnchor] = labelDist(dx, dy, alpha3Code);
          }
        }

        if (Object.keys(labelAnchors).includes(alpha3Code)) {
          textAnchor = labelAnchors[alpha3Code];
        }
      }
      return markerDisplay && (
          <Marker
            key={alpha3Code}
            marker={marker}
            style={{
              default: { fill: '#FF5722' },
              hover: { fill: '#FFFFFF' },
              pressed: { fill: '#FF5722' },
            }}
          >
            {testing === 'capital' && (
              <circle
                cx={0}
                cy={0}
                r={1}
                className="dropFade"
                style={{
                  stroke: '#FF5722',
                  strokeWidth: 3,
                  opacity: 0.9,
                }}
              />
            )}
            <text
              textAnchor={textAnchor}
              x={dx}
              y={dy}
              className="mapLabel dropFade"
            >
              {markerName}
            </text>
          </Marker>
        )
    })}
  </Markers>
}
