import React from 'react';
import { Markers, Marker } from 'react-simple-maps';
import { labelDist, tinyCarib, labelAnchors } from './markerParams';
import { getMarkerConfig, getRegionMarker } from './regionLabelsHelpers';

export default function regionLabels() {
  const { isQuizActive, quizGuesses } = this.props.quiz;
  const { capitalMarkers } = this.props.data;
  const { currentMap, regionKey } = this.props.map;
  const { display, markerArray, testing } = getMarkerConfig()

  return display && <Markers>
    {markerArray.map((regionID, i) => {
      const markerDisplay = isQuizActive ? quizGuesses[i] : true;
      if (!markerDisplay) return null;

      let marker = getRegionMarker(regionID, testing);
      if (!marker) return null

      const markerName = marker.name;
      let textAnchor = 'middle';
      let dx = 0;
      let dy = marker ? marker.markerOffset : 0;

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
