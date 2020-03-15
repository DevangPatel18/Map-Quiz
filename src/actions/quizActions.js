import * as types from './types';
import {
  removeQuizExceptions,
  generateAnswerArray,
  checkClickAnswer,
  checkTypeAnswer,
  getRegionIdsForQuiz,
} from '../helpers/quizActionHelpers';
import { partialMapRefresh } from './mapActions';
import store from '../store';

export const startQuiz = () => async dispatch => {
  const { filterRegions } = store.getState().map;
  const quizRegionIds = getRegionIdsForQuiz();
  let quizAnswers = generateAnswerArray(quizRegionIds);
  quizAnswers = removeQuizExceptions(quizAnswers);
  await dispatch({ type: types.SET_QUIZ_STATE, quizAnswers });
  await partialMapRefresh(dispatch, filterRegions);
};

export const giveUpQuiz = () => dispatch => {
  dispatch({ type: types.QUIZ_GIVE_UP });
};

export const closeQuiz = () => async dispatch => {
  const { filterRegions } = store.getState().map;
  await dispatch({ type: types.QUIZ_CLOSE });
  await partialMapRefresh(dispatch, filterRegions);
};

export const changeQuiz = quizType => dispatch => {
  dispatch({ type: types.CHANGE_QUIZ, quizType });
};

export const processClickAnswer = geoProperties => async dispatch => {
  const { isAnswerCorrect, newGeoProperties } = checkClickAnswer(geoProperties);
  const { quizAnswers, quizGuesses, quizIdx } = store.getState().quiz;
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
  if (quizIdx > 0 && quizGuesses[quizIdx - 1]) {
    updatedRegionIDList.push(quizAnswers[quizIdx - 1]);
  }
  await partialMapRefresh(dispatch, updatedRegionIDList);
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
  await partialMapRefresh(dispatch, updatedRegionIDList);
};

export const toggleInfoTab = () => async dispatch => {
  const { selectedProperties, infoTabShow } = store.getState().quiz;
  await dispatch({
    type: types.REGION_CLICK,
    selectedProperties,
    infoTabShow: !infoTabShow,
  });
  await partialMapRefresh(dispatch, [selectedProperties.regionID]);
};

export const processTypeAnswer = (userGuess = null) => async dispatch => {
  const { isAnswerCorrect, newGeoProperties } = checkTypeAnswer(userGuess);
  const { quizAnswers, quizIdx, isQtnFixed } = store.getState().quiz;
  if (!isQtnFixed && !isAnswerCorrect) return;
  const updatedRegionIDList = isQtnFixed
    ? quizAnswers.slice(quizIdx, quizIdx + 2)
    : [newGeoProperties.regionID];
  await dispatch({
    type: types.QUIZ_ANSWER,
    selectedProperties: newGeoProperties,
    isAnswerCorrect,
  });
  await partialMapRefresh(dispatch, updatedRegionIDList);
};

export const setLabel = (markerToggle = '') => async dispatch => {
  await dispatch({ type: types.SET_LABEL, markerToggle });
  dispatch({ type: types.DISABLE_OPT });
};

export const toggleExternalRegions = () => dispatch =>
  dispatch({ type: types.TOGGLE_EXT_REGIONS });

export const toggleTimer = () => dispatch =>
  dispatch({ type: types.TOGGLE_TIMER });
