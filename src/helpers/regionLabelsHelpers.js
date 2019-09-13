import store from '../store';

export const markerConfig = () => {
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
