import {
  SET_QUIZ_STATE,
  QUIZ_ANSWER,
  QUIZ_CLOSE,
  REGION_CLICK,
  DISABLE_OPT,
  SET_LABEL,
} from './types';
import {
  generateAnswerArray,
  generateQuizState,
  checkClickAnswer,
  checkTypeAnswer,
} from '../helpers/quizActionHelpers';
import store from '../store';

export const startQuiz = quizType => async dispatch => {
  const { filterRegions } = store.getState().map;
  const quizAnswers = generateAnswerArray(filterRegions);
  const quizAttributes = generateQuizState(quizAnswers, quizType);
  await dispatch({ type: SET_QUIZ_STATE, quizAttributes });
  dispatch({ type: DISABLE_OPT });
};

export const closeQuiz = () => async dispatch => {
  await dispatch({ type: QUIZ_CLOSE });
  dispatch({ type: DISABLE_OPT });
};

export const processClickAnswer = geoProperties => async dispatch => {
  const { activeQuestionNum, quizGuesses } = store.getState().quiz;
  const { isAnswerCorrect, newGeoProperties } = checkClickAnswer(geoProperties);
  await dispatch({
    type: QUIZ_ANSWER,
    selectedProperties: newGeoProperties,
    quizGuesses: [...quizGuesses, isAnswerCorrect],
    activeQuestionNum: activeQuestionNum + 1,
    infoTabShow: false,
  });
  await dispatch({
    type: REGION_CLICK,
    selectedProperties: newGeoProperties,
    infoTabShow: isAnswerCorrect,
  });
  dispatch({ type: DISABLE_OPT });
};

export const loadNewInfoTab = newGeoProperties => async dispatch => {
  await dispatch({
    type: REGION_CLICK,
    selectedProperties: newGeoProperties,
    infoTabShow: false,
  });
  await dispatch({
    type: REGION_CLICK,
    selectedProperties: newGeoProperties,
    infoTabShow: true,
  });
  dispatch({ type: DISABLE_OPT });
};

export const toggleInfoTab = () => async dispatch => {
  const { selectedProperties, infoTabShow } = store.getState().quiz;
  await dispatch({
    type: REGION_CLICK,
    selectedProperties,
    infoTabShow: !infoTabShow,
  });
  dispatch({ type: DISABLE_OPT });
};

export const processTypeAnswer = (userGuess = null) => async dispatch => {
  const { quizGuesses, activeQuestionNum } = store.getState().quiz;
  const { isAnswerCorrect, newGeoProperties } = checkTypeAnswer(userGuess);
  await dispatch({
    type: QUIZ_ANSWER,
    selectedProperties: newGeoProperties,
    quizGuesses: [...quizGuesses, isAnswerCorrect],
    activeQuestionNum: activeQuestionNum + 1,
  });
  dispatch({ type: DISABLE_OPT });
};

export const setLabel = (markerToggle = '') => async dispatch => {
  await dispatch({ type: SET_LABEL, markerToggle });
  dispatch({ type: DISABLE_OPT });
};
