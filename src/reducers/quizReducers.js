import * as types from '../actions/types';

const emptySelectedProperties = {
  name: '',
  capital: '',
  population: '',
  area: '',
  regionOf: '',
};

const initialState = {
  quizAnswers: [],
  quizType: null,
  isQuizActive: false,
  activeQuestionNum: null,
  quizGuesses: [],
  selectedProperties: emptySelectedProperties,
  isTypeQuizActive: false,
  markerToggle: '',
  infoTabShow: false,
  areExternalRegionsOnQuiz: true,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_MAP_VIEW:
      return {
        ...state,
        selectedProperties: emptySelectedProperties,
        markerToggle: '',
        infoTabShow: false,
      };
    case types.REGION_SELECT:
      return {
        ...state,
        selectedProperties: action.selectedProperties,
        infoTabShow: true,
      };
    case types.REGION_CLICK:
      return {
        ...state,
        selectedProperties: action.selectedProperties,
        infoTabShow: action.infoTabShow,
      };
    case types.QUIZ_ANSWER:
      return {
        ...state,
        selectedProperties:
          action.selectedProperties || emptySelectedProperties,
        quizGuesses: [...state.quizGuesses, action.isAnswerCorrect],
        activeQuestionNum: state.activeQuestionNum + 1,
        infoTabShow: false,
      };
    case types.SET_QUIZ_STATE:
      return {
        ...state,
        ...action.quizAttributes,
        selectedProperties: emptySelectedProperties,
        infoTabShow: false,
      };
    case types.QUIZ_CLOSE:
      return {
        ...state,
        quizAnswers: [],
        quizGuesses: [],
        isQuizActive: false,
        quizType: null,
        activeQuestionNum: null,
        isTypeQuizActive: false,
        selectedProperties: emptySelectedProperties,
        infoTabShow: false,
      };
    case types.SET_LABEL:
      return {
        ...state,
        markerToggle: action.markerToggle,
      };
    case types.LOAD_REGION_DATA:
      return {
        ...state,
        markerToggle: '',
      };
    case types.TOGGLE_EXT_REGIONS:
      return {
        ...state,
        areExternalRegionsOnQuiz: !state.areExternalRegionsOnQuiz,
      };
    default:
      return state;
  }
}
