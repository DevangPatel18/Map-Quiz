import {
  QUIZ_STATE,
  QUIZ_ANSWER,
  QUIZ_CLOSE,
  COUNTRY_CLICK,
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
    default:
      return state;
  }
}
