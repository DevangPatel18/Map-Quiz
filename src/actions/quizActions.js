import {
  QUIZ_STATE,
  CLICK_ANSWER,
  QUIZ_CLOSE,
  COUNTRY_CLICK,
  DISABLE_OPT,
} from './types';
import store from '../store';

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
