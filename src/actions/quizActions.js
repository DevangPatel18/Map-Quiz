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
} from '../helpers/quizActionHelpers';
import removeDiacritics from '../helpers/removeDiacritics';
import store from '../store';

const simple = str =>
  removeDiacritics(str.toLowerCase())
    .replace(/\u002D/g, ' ')
    .replace(/[^\w\s]/g, '');

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

export const processAnswerClick = newGeoProperties => async dispatch => {
  const {
    activeQuestionNum,
    quizGuesses,
    quizAnswers,
    selectedProperties,
  } = store.getState().quiz;
  const { regionKey } = store.getState().map;
  const result = newGeoProperties[regionKey] === quizAnswers[activeQuestionNum];
  const newSelectedProperties = result ? newGeoProperties : selectedProperties;
  await dispatch({
    type: QUIZ_ANSWER,
    selectedProperties: newSelectedProperties,
    quizGuesses: [...quizGuesses, result],
    activeQuestionNum: activeQuestionNum + 1,
    infoTabShow: false,
  });
  await dispatch({
    type: REGION_CLICK,
    selectedProperties: newSelectedProperties,
    infoTabShow: result,
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

export const answerQuiz = (userGuess = null) => async dispatch => {
  const {
    quizGuesses,
    quizAnswers,
    activeQuestionNum,
    quizType,
  } = store.getState().quiz;
  const { geographyPaths } = store.getState().data;
  const { regionKey } = store.getState().map;

  if (userGuess) {
    let result;

    const answerProperties = geographyPaths.find(
      geo => geo.properties[regionKey] === quizAnswers[activeQuestionNum]
    ).properties;

    if (quizType.split('_')[1] === 'name') {
      result = answerProperties.spellings.some(
        name => simple(userGuess) === simple(name)
      );
    } else {
      result = simple(userGuess) === simple(answerProperties.capital);
    }

    const selectedProperties = result ? answerProperties : '';

    await dispatch({
      type: QUIZ_ANSWER,
      selectedProperties,
      quizGuesses: [...quizGuesses, result],
      activeQuestionNum: activeQuestionNum + 1,
    });
    dispatch({ type: DISABLE_OPT });
  }
};

export const setLabel = (markerToggle = '') => async dispatch => {
  await dispatch({ type: SET_LABEL, markerToggle });
  dispatch({ type: DISABLE_OPT });
};
