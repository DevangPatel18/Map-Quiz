import {
  SET_QUIZ_STATE,
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
    case SET_QUIZ_STATE:
      return {
        ...state,
        ...action.quiz,
      };
    case QUIZ_CLOSE:
      return {
        ...state,
        quizAnswers: [],
        quizGuesses: [],
        quiz: false,
        quizType: null,
        activeQuestionNum: null,
        disableInfoClick: false,
        selectedProperties: '',
      };
    default:
      return state;
  }
}
