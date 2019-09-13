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
  const { regionKey } = store.getState().map;
  let marker;
  if (testing === 'name' || testing === 'flag') {
    marker = regionMarkers.find(x => x[regionKey] === regionID);
  } else if (testing === 'capital') {
    marker = capitalMarkers.find(x => x[regionKey] === regionID);
  }
  return marker;
};
