import * as types from './types';
import {
  removeQuizExceptions,
  generateAnswerArray,
  generateQuizState,
  checkClickAnswer,
  checkTypeAnswer,
  getRegionIdsForQuiz,
} from '../helpers/quizActionHelpers';
import { getSelectUpdatedRegionStyles } from '../helpers/MapHelpers';
import store from '../store';

export const startQuiz = quizType => async dispatch => {
  const { filterRegions } = store.getState().map;
  const quizRegionIds = getRegionIdsForQuiz();
  let quizAnswers = generateAnswerArray(quizRegionIds);
  quizAnswers = removeQuizExceptions(quizAnswers, quizType);
  const quizAttributes = generateQuizState(quizAnswers, quizType);
  await dispatch({ type: types.SET_QUIZ_STATE, quizAttributes });
  await dispatch({
    type: types.UPDATE_MAP,
    regionStyles: getSelectUpdatedRegionStyles(filterRegions),
  });
  dispatch({ type: types.DISABLE_OPT });
};

export const closeQuiz = () => async dispatch => {
  const { filterRegions } = store.getState().map;
  await dispatch({ type: types.QUIZ_CLOSE });
  await dispatch({
    type: types.UPDATE_MAP,
    regionStyles: getSelectUpdatedRegionStyles(filterRegions),
  });
  dispatch({ type: types.DISABLE_OPT });
};

export const processClickAnswer = geoProperties => async dispatch => {
  const { isAnswerCorrect, newGeoProperties } = checkClickAnswer(geoProperties);
  const { quizAnswers, quizIdx } = store.getState().quiz;
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
  const updatedRegionIDList = quizAnswers.slice(quizIdx, quizIdx + 2);
  await dispatch({
    type: types.UPDATE_MAP,
    regionStyles: getSelectUpdatedRegionStyles(updatedRegionIDList),
  });
  dispatch({ type: types.DISABLE_OPT });
};

export const loadNewInfoTab = newGeoProperties => async dispatch => {
  const { selectedProperties } = store.getState().quiz;
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
  const updatedRegionIDList = [
    newGeoProperties.regionID,
    selectedProperties.regionID,
  ];
  await dispatch({
    type: types.UPDATE_MAP,
    regionStyles: getSelectUpdatedRegionStyles(updatedRegionIDList),
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
  await dispatch({
    type: types.UPDATE_MAP,
    regionStyles: getSelectUpdatedRegionStyles([selectedProperties.regionID]),
  });
  dispatch({ type: types.DISABLE_OPT });
};

export const processTypeAnswer = (userGuess = null) => async dispatch => {
  const { isAnswerCorrect, newGeoProperties } = checkTypeAnswer(userGuess);
  const { quizAnswers, quizIdx } = store.getState().quiz;
  await dispatch({
    type: types.QUIZ_ANSWER,
    selectedProperties: newGeoProperties,
    isAnswerCorrect,
  });
  const updatedRegionIDList = quizAnswers.slice(quizIdx, quizIdx + 2);
  await dispatch({
    type: types.UPDATE_MAP,
    regionStyles: getSelectUpdatedRegionStyles(updatedRegionIDList),
  });
  dispatch({ type: types.DISABLE_OPT });
};

export const setLabel = (markerToggle = '') => async dispatch => {
  await dispatch({ type: types.SET_LABEL, markerToggle });
  dispatch({ type: types.DISABLE_OPT });
};

export const toggleExternalRegions = () => dispatch =>
  dispatch({ type: types.TOGGLE_EXT_REGIONS });
