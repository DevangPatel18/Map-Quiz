import * as types from './types';
import {
  removeQuizExceptions,
  generateAnswerArray,
  generateQuizState,
  checkClickAnswer,
  checkTypeAnswer,
  getRegionIdsForQuiz,
} from '../helpers/quizActionHelpers';
import store from '../store';

export const startQuiz = quizType => async dispatch => {
  const quizRegionIds = getRegionIdsForQuiz();
  let quizAnswers = generateAnswerArray(quizRegionIds);
  quizAnswers = removeQuizExceptions(quizAnswers, quizType);
  const quizAttributes = generateQuizState(quizAnswers, quizType);
  await dispatch({ type: types.SET_QUIZ_STATE, quizAttributes });
  dispatch({ type: types.DISABLE_OPT });
};

export const closeQuiz = () => async dispatch => {
  await dispatch({ type: types.QUIZ_CLOSE });
  dispatch({ type: types.DISABLE_OPT });
};

export const processClickAnswer = geoProperties => async dispatch => {
  const { isAnswerCorrect, newGeoProperties } = checkClickAnswer(geoProperties);
  await dispatch({
    type: types.QUIZ_ANSWER,
    selectedProperties: newGeoProperties,
    isAnswerCorrect,
  });
  await dispatch({
    type: types.REGION_CLICK,
    selectedProperties: newGeoProperties,
    infoTabShow: isAnswerCorrect,
  });
  dispatch({ type: types.DISABLE_OPT });
};

export const loadNewInfoTab = newGeoProperties => async dispatch => {
  await dispatch({
    type: types.REGION_CLICK,
    selectedProperties: newGeoProperties,
    infoTabShow: false,
  });
  await dispatch({
    type: types.REGION_CLICK,
    selectedProperties: newGeoProperties,
    infoTabShow: true,
  });
  dispatch({ type: types.DISABLE_OPT });
};

export const toggleInfoTab = () => async dispatch => {
  const { selectedProperties, infoTabShow } = store.getState().quiz;
  await dispatch({
    type: types.REGION_CLICK,
    selectedProperties,
    infoTabShow: !infoTabShow,
  });
  dispatch({ type: types.DISABLE_OPT });
};

export const processTypeAnswer = (userGuess = null) => async dispatch => {
  const { isAnswerCorrect, newGeoProperties } = checkTypeAnswer(userGuess);
  await dispatch({
    type: types.QUIZ_ANSWER,
    selectedProperties: newGeoProperties,
    isAnswerCorrect,
  });
  dispatch({ type: types.DISABLE_OPT });
};

export const setLabel = (markerToggle = '') => async dispatch => {
  await dispatch({ type: types.SET_LABEL, markerToggle });
  dispatch({ type: types.DISABLE_OPT });
};

export const toggleExternalRegions = () => dispatch =>
  dispatch({ type: types.TOGGLE_EXT_REGIONS });
