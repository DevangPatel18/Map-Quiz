import {
  SET_QUIZ_STATE,
  QUIZ_ANSWER,
  QUIZ_CLOSE,
  REGION_CLICK,
  CHANGE_MAP_VIEW,
  REGION_SELECT,
  SET_LABEL,
  LOAD_REGION_DATA,
} from '../actions/types';

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
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CHANGE_MAP_VIEW:
      return {
        ...state,
        ...action.quizAttributes,
        selectedProperties: emptySelectedProperties,
        infoTabShow: false,
      };
    case REGION_SELECT:
      return {
        ...state,
        selectedProperties: action.selectedProperties,
        infoTabShow: true,
      };
    case REGION_CLICK:
      return {
        ...state,
        selectedProperties: action.selectedProperties,
        infoTabShow: action.infoTabShow,
      };
    case QUIZ_ANSWER:
      return {
        ...state,
        selectedProperties:
          action.selectedProperties || emptySelectedProperties,
        quizGuesses: action.quizGuesses,
        activeQuestionNum: action.activeQuestionNum,
        infoTabShow: action.infoTabShow,
      };
    case SET_QUIZ_STATE:
      return {
        ...state,
        ...action.quizAttributes,
        selectedProperties: emptySelectedProperties,
        infoTabShow: false,
      };
    case QUIZ_CLOSE:
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
    case SET_LABEL:
      return {
        ...state,
        markerToggle: action.markerToggle,
      };
    case LOAD_REGION_DATA:
      return {
        ...state,
        markerToggle: '',
      };
    default:
      return state;
  }
}
