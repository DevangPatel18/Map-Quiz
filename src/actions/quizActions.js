import { QUIZ_STATE, CLICK_ANSWER, QUIZ_CLOSE, COUNTRY_CLICK } from './types';
import store from '../store';

export const countryClick = geographyPath => dispatch => {
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
      dispatch({
        type: CLICK_ANSWER,
        selectedProperties: newSelectedProperties,
        quizGuesses: [...quizGuesses, result],
        activeQuestionNum: activeQuestionNum + 1,
      });
    } else {
      newSelectedProperties =
        selectedProperties.name !== geoProperties.name ? geoProperties : '';
      dispatch({
        type: COUNTRY_CLICK,
        selectedProperties: newSelectedProperties,
      });
    }
  }
};
