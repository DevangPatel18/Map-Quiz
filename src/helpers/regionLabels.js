import React from 'react';
import { Markers, Marker } from 'react-simple-maps';
import { labelDist, tinyCarib, labelAnchors } from './markerParams';
import { markerConfig } from './regionLabelsHelpers';

export default function regionLabels() {
  const { isQuizActive, quizGuesses } = this.props.quiz;
  const { regionMarkers, capitalMarkers } = this.props.data;
  const { currentMap, regionKey } = this.props.map;
  const { display, markerArray, testing } = markerConfig()

  return display && <Markers>
    {markerArray.map((regionID, i) => {
      let marker;
      let markerName;
      let textAnchor;
      let dx;
      let dy;
      const markerDisplay = isQuizActive ? quizGuesses[i] : true;
      if (markerDisplay) {
        if (testing === 'name' || testing === 'flag') {
          marker = regionMarkers.find(x => (x[regionKey]) === regionID);
        } else if (testing === 'capital') {
          marker = capitalMarkers.find(x => x[regionKey] === regionID);
        }
        if(!marker) return null
        markerName = marker.name;
        textAnchor = 'middle';
        dx = 0;
        dy = marker ? marker.markerOffset : 0;

        if (currentMap === 'Caribbean') {
          if (tinyCarib.includes(regionID)) {
            marker =
              testing !== 'capital'
                ? capitalMarkers.find(x => x[regionKey] === regionID)
                : marker;
            dx = 20;
            dy = -20;
            [dx, dy, textAnchor] = labelDist(dx, dy, regionID);
          }
        }

        if (Object.keys(labelAnchors).includes(regionID)) {
          textAnchor = labelAnchors[regionID];
        }
      }
      return markerDisplay && (
          <Marker
            key={regionID}
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
