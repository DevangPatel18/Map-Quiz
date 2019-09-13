import React from 'react';
import { Markers, Marker } from 'react-simple-maps';
import {
  getMarkerConfig,
  getRegionMarker,
  getLabelData,
} from './regionLabelsHelpers';

export default function regionLabels() {
  const { isQuizActive, quizGuesses } = this.props.quiz;
  const { display, markerArray, testing } = getMarkerConfig();
  if (!display) return null;

  return (
    <Markers>
      {markerArray.map((regionID, i) => {
        const markerDisplay = isQuizActive ? quizGuesses[i] : true;
        if (!markerDisplay) return null;

        const initialMarker = getRegionMarker(regionID, testing);
        if (!initialMarker) {
          console.log(`${testing} marker does not exist for ${regionID}`);
          return null
        };

        const labelData = getLabelData(initialMarker, regionID, testing);
        const { marker, markerName, textAnchor, deltaX, deltaY } = labelData;

        return (
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
              x={deltaX}
              y={deltaY}
              className="mapLabel dropFade"
            >
              {markerName}
            </text>
          </Marker>
        );
      })}
    </Markers>
  );
}
