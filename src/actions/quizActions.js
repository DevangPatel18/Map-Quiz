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
  checkIfQuizIncomplete,
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

export const regionClick = geographyPath => async dispatch => {
  const {
    isTypeQuizActive,
    activeQuestionNum,
    quizGuesses,
    quizAnswers,
    selectedProperties,
    infoTabShow,
  } = store.getState().quiz;
  if (isTypeQuizActive) return;
  const { regionKey } = store.getState().map;
  const geoProperties = geographyPath.properties;
  let newSelectedProperties;
  if (checkIfQuizIncomplete()) {
    const result = geoProperties[regionKey] === quizAnswers[activeQuestionNum];
    newSelectedProperties = result ? geoProperties : selectedProperties;
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
    return;
  }
  if (geoProperties.name !== selectedProperties.name) {
    await dispatch({
      type: REGION_CLICK,
      selectedProperties: geoProperties,
      infoTabShow: false,
    });
    await dispatch({
      type: REGION_CLICK,
      selectedProperties: geoProperties,
      infoTabShow: true,
    });
    return;
  }
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
