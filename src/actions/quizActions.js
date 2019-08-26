import {
  SET_QUIZ_STATE,
  QUIZ_ANSWER,
  QUIZ_CLOSE,
  REGION_CLICK,
  DISABLE_OPT,
  SET_LABEL,
} from './types';
import removeDiacritics from '../helpers/removeDiacritics';
import store from '../store';

const simple = str =>
  removeDiacritics(str.toLowerCase())
    .replace(/\u002D/g, ' ')
    .replace(/[^\w\s]/g, '');

export const startQuiz = quizType => async dispatch => {
  const { filterRegions } = store.getState().map;
  const quizAnswers = [...filterRegions];
  quizAnswers.reduce((dum1, dum2, i) => {
    const j = Math.floor(Math.random() * (quizAnswers.length - i) + i);
    [quizAnswers[i], quizAnswers[j]] = [quizAnswers[j], quizAnswers[i]];
    return quizAnswers;
  }, quizAnswers);

  const quiz = {
    quizAnswers,
    quizType,
    quiz: true,
    activeQuestionNum: 0,
    quizGuesses: [],
    selectedProperties: '',
    disableInfoClick: quizType.split('_')[0] === 'type',
  };
  await dispatch({ type: SET_QUIZ_STATE, quiz });
  dispatch({ type: DISABLE_OPT });
};

export const closeQuiz = () => async dispatch => {
  await dispatch({ type: QUIZ_CLOSE });
  dispatch({ type: DISABLE_OPT });
};

export const regionClick = geographyPath => async dispatch => {
  const {
    disableInfoClick,
    activeQuestionNum,
    quizGuesses,
    quizAnswers,
    selectedProperties,
    infoTabShow,
  } = store.getState().quiz;
  const { regionKey } = store.getState().map;
  const geoProperties = geographyPath.properties;
  let newSelectedProperties;
  if (!disableInfoClick) {
    if (
      activeQuestionNum === quizGuesses.length &&
      quizGuesses.length < quizAnswers.length
    ) {
      const result =
        geoProperties[regionKey] === quizAnswers[activeQuestionNum];
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
    } else {
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
      } else {
        await dispatch({
          type: REGION_CLICK,
          selectedProperties,
          infoTabShow: !infoTabShow,
        });
      }
      dispatch({ type: DISABLE_OPT });
    }
  }
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
