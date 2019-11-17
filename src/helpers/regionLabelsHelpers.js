import { labelDist, tinyCarib, labelAnchors } from './markerParams';
import store from '../store';

export const getMarkerConfig = () => {
  const { quiz, map } = store.getState();
  const { isQuizActive, quizType, quizAnswers, markerToggle } = quiz;
  const { filterRegions } = map;
  let markerArray;
  let testing;
  let display = true;
  if (isQuizActive) {
    markerArray = quizAnswers;
    testing = quizType.split('_')[1];
  } else if (markerToggle !== '') {
    markerArray = filterRegions;
    testing = markerToggle;
  } else {
    display = false;
  }
  return { display, markerArray, testing };
};

export const getRegionMarker = (regionID, testing) => {
  const { regionMarkers, capitalMarkers } = store.getState().data;
  let marker;
  if (testing === 'name' || testing === 'flag') {
    marker = regionMarkers.find(x => x.regionID === regionID);
  } else if (testing === 'capital') {
    marker = capitalMarkers.find(x => x.regionID === regionID);
  }
  return marker;
};

export const updateMarkerForSmallCarib = (labelData, regionID, testing) => {
  const { capitalMarkers } = store.getState().data;
  const [deltaX, deltaY, textAnchor] = labelDist(20, -20, regionID);
  labelData.marker =
    testing !== 'capital'
      ? capitalMarkers.find(x => x.regionID === regionID)
      : labelData.marker;
  labelData.deltaX = deltaX;
  labelData.deltaY = deltaY;
  labelData.textAnchor = textAnchor;
};

export const getLabelData = (marker, regionID, testing) => {
  const { currentMap } = store.getState().map;

  const labelData = {
    marker,
    markerName: marker.name,
    textAnchor: 'middle',
    deltaX: 0,
    deltaY: marker ? marker.markerOffset : 0,
  };

  if (currentMap === 'Caribbean' && tinyCarib.includes(regionID)) {
    updateMarkerForSmallCarib(labelData, regionID, testing);
  }

  if (Object.keys(labelAnchors).includes(regionID)) {
    labelData.textAnchor = labelAnchors[regionID];
  }

  return labelData;
};
