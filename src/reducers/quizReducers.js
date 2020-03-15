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
  quizType: 'click_name_ordered',
  isQuizActive: false,
  quizIdx: null,
  quizGuesses: [],
  selectedProperties: emptySelectedProperties,
  isTypeQuizMarked: false,
  isQtnFixed: true,
  regionClass: 'name',
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
      const quizGuessesUpdated = state.quizGuesses.slice();
      if (state.isQtnFixed) {
        quizGuessesUpdated.push(action.isAnswerCorrect);
      } else {
        const { regionID } = action.selectedProperties;
        const idx = state.quizAnswers.indexOf(regionID);
        if (idx < 0) {
          console.log('regionID not found in answer array');
          return { ...state };
        }
        quizGuessesUpdated[idx] = action.isAnswerCorrect;
      }
      return {
        ...state,
        selectedProperties:
          action.selectedProperties || emptySelectedProperties,
        quizGuesses: quizGuessesUpdated,
        quizIdx: state.quizIdx + 1,
        infoTabShow: false,
      };
    case types.CHANGE_QUIZ:
      const [behaviour, regionClass, sortType] = action.quizType.split('_');
      return {
        ...state,
        quizType: action.quizType,
        isTypeQuizMarked: behaviour === 'type',
        isQtnFixed: sortType === 'ordered',
        regionClass,
      };
    case types.SET_QUIZ_STATE:
      return {
        ...state,
        quizAnswers: action.quizAnswers,
        isQuizActive: true,
        quizIdx: 0,
        quizGuesses: [],
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
        quizIdx: null,
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
