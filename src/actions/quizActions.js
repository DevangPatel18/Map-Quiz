import {
  SET_QUIZ_STATE,
  QUIZ_ANSWER,
  QUIZ_CLOSE,
  COUNTRY_CLICK,
  DISABLE_OPT,
  SET_LABEL,
} from './types';
import removeDiacritics from '../helpers/removeDiacritics';
import store from '../store';
import infoTab from '../components/infoTab/infoTab';

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

export const countryClick = geographyPath => async dispatch => {
  const {
    disableInfoClick,
    activeQuestionNum,
    quizGuesses,
    quizAnswers,
    selectedProperties,
    infoTabShow,
  } = store.getState().quiz;
  const geoProperties = geographyPath.properties;
  let newSelectedProperties;
  if (!disableInfoClick) {
    if (
      activeQuestionNum === quizGuesses.length &&
      quizGuesses.length < quizAnswers.length
    ) {
      const result =
        geoProperties.alpha3Code === quizAnswers[activeQuestionNum];
      newSelectedProperties = result ? geoProperties : selectedProperties;
      await dispatch({
        type: QUIZ_ANSWER,
        selectedProperties: newSelectedProperties,
        quizGuesses: [...quizGuesses, result],
        activeQuestionNum: activeQuestionNum + 1,
        infoTabShow: false,
      });
      await dispatch({
        type: COUNTRY_CLICK,
        selectedProperties: newSelectedProperties,
        infoTabShow: result,
      });
      dispatch({ type: DISABLE_OPT });
    } else {
      newSelectedProperties =
        selectedProperties.name !== geoProperties.name
          ? geoProperties
          : selectedProperties;
      await dispatch({
        type: COUNTRY_CLICK,
        selectedProperties: selectedProperties,
        infoTabShow: false,
      });
      await dispatch({
        type: COUNTRY_CLICK,
        selectedProperties: newSelectedProperties,
        infoTabShow: selectedProperties === geoProperties ? !infoTabShow : true,
      });
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

  if (userGuess) {
    let result;

    const answerProperties = geographyPaths.find(
      geo => geo.properties.alpha3Code === quizAnswers[activeQuestionNum]
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
