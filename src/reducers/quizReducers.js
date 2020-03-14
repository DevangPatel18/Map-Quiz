import * as types from '../actions/types';

const timerLocalStorage = localStorage.getItem('timer');
const userTimer =
  timerLocalStorage !== null ? timerLocalStorage === 'true' : true;

const emptySelectedProperties = {
  name: '',
  capital: '',
  population: '',
  area: '',
  regionOf: '',
};

const initialState = {
  quizAnswers: [],
  quizType: 'click_name',
  isQuizActive: false,
  quizIdx: null,
  quizGuesses: [],
  selectedProperties: emptySelectedProperties,
  isTypeQuizActive: false,
  isAnsFixed: null,
  regionClass: null,
  markerToggle: '',
  infoTabShow: false,
  areExternalRegionsOnQuiz: true,
  isTimerEnabled: userTimer,
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
        quizIdx: state.quizIdx + 1,
        infoTabShow: false,
      };
    case types.CHANGE_QUIZ:
      return { ...state, quizType: action.quizType };
    case types.SET_QUIZ_STATE:
      return {
        ...state,
        ...action.quizAttributes,
        selectedProperties: emptySelectedProperties,
        infoTabShow: false,
      };
    case types.QUIZ_GIVE_UP:
      const newQuizGuesses = state.quizAnswers.map((_, idx) =>
        state.quizGuesses[idx] ? state.quizGuesses[idx] : false
      );
      return {
        ...state,
        quizIdx: state.quizAnswers.length,
        quizGuesses: newQuizGuesses,
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
        quizIdx: null,
        isTypeQuizActive: false,
        isAnsFixed: null,
        regionClass: null,
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
    case types.TOGGLE_TIMER:
      localStorage.setItem('timer', (!state.isTimerEnabled).toString());
      return {
        ...state,
        isTimerEnabled: !state.isTimerEnabled,
      };
    default:
      return state;
  }
}
