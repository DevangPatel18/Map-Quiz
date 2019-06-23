import {
  QUIZ_STATE,
  QUIZ_ANSWER,
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
      return {
        ...state,
        selectedProperties: action.selectedProperties,
      };
    default:
      return state;
  }
}
