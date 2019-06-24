import {
  QUIZ_STATE,
  CLICK_ANSWER,
  QUIZ_CLOSE,
  COUNTRY_CLICK,
  REGION_SELECT,
  COUNTRY_SELECT,
} from '../actions/types';

const initialState = {
  quizAnswers: [],
  quizType: null,
  quiz: false,
  activeQuestionNum: null,
  quizGuesses: [],
  selectedProperties: '',
  disableInfoClick: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REGION_SELECT:
      return {
        ...state,
        ...action.quiz,
      };
    case COUNTRY_SELECT:
    case COUNTRY_CLICK:
      return {
        ...state,
        selectedProperties: action.selectedProperties,
      };
    case CLICK_ANSWER:
      return {
        ...state,
        selectedProperties: action.selectedProperties,
        quizGuesses: action.quizGuesses,
        activeQuestionNum: action.activeQuestionNum,
      };
    default:
      return state;
  }
}
