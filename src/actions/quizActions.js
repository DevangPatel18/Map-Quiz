import {
  SET_QUIZ_STATE,
  CLICK_ANSWER,
  QUIZ_CLOSE,
  COUNTRY_CLICK,
  DISABLE_OPT,
} from './types';
import store from '../store';

export const initializeQuiz = quizType => async dispatch => {
  const { filterRegions } = this.state;
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

export const closeQuiz = async dispatch => {
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
      newSelectedProperties = result ? geoProperties : '';
      await dispatch({
        type: CLICK_ANSWER,
        selectedProperties: newSelectedProperties,
        quizGuesses: [...quizGuesses, result],
        activeQuestionNum: activeQuestionNum + 1,
      });
      dispatch({ type: DISABLE_OPT });
    } else {
      newSelectedProperties =
        selectedProperties.name !== geoProperties.name ? geoProperties : '';
      await dispatch({
        type: COUNTRY_CLICK,
        selectedProperties: newSelectedProperties,
      });
      dispatch({ type: DISABLE_OPT });
    }
  }
};
