import { choroplethColor } from './choroplethFunctions';
import store from '../store';

const RIGHT_ANSWER_COLOR = 'rgb(144, 238, 144)';
const WRONG_ANSWER_COLOR = 'rgb(255, 69, 0)';
const PROMPT_COLOR = 'rgb(255, 255, 0)';

const ColorPicker = geo => {
  const {
    isQuizActive,
    quizGuesses,
    quizAnswers,
    isTypeQuizActive,
    activeQuestionNum,
    selectedProperties,
    infoTabShow,
  } = store.getState().quiz;
  const { regionKey } = store.getState().map;
  const { filterRegions, currentMap, choropleth, defaultZoom } = store.getState().map;
  const isSelected =
    selectedProperties === geo.properties ? infoTabShow : false;
  const { regionOf } = geo.properties;
  const regionID = geo.properties[regionKey]
  let defaultColor = 'rgb(0, 140, 0)';
  let hoverColor = 'rgb(0, 120, 0)';
  let pressedColor = 'rgb(0, 70, 0)';
  let strokeWidth = 0.05;
  let strokeColor = 'black';

  if (isSelected) {
    defaultColor = 'rgb(0, 100, 0)';
    hoverColor = 'rgb(0, 100, 0)';
    strokeWidth = 1 / defaultZoom;
    strokeColor = PROMPT_COLOR;
  }

  if (isQuizActive === true) {
    const geoQuizIdx = quizAnswers.indexOf(regionID);

    // Fills region with name input request as yellow
    if (isTypeQuizActive && quizAnswers[activeQuestionNum] === regionID) {
      defaultColor = PROMPT_COLOR;
      hoverColor = PROMPT_COLOR;
    }

    // Fills correct status of region name guess, green for correct and red for incorrect
    if (isTypeQuizActive) {
      if (quizGuesses[geoQuizIdx] !== undefined) {
        const answer = quizGuesses[geoQuizIdx][1]
          ? RIGHT_ANSWER_COLOR
          : WRONG_ANSWER_COLOR;
        defaultColor = answer;
        hoverColor = answer;
      }
    }

    // Fills incorrect region clicks red
    if (!isTypeQuizActive && regionID !== quizAnswers[activeQuestionNum]) {
      pressedColor = WRONG_ANSWER_COLOR;
    }

    // Fills correct region clicks green
    if (!isTypeQuizActive && regionID === quizAnswers[activeQuestionNum]) {
      pressedColor = RIGHT_ANSWER_COLOR;
    }

    // Fills correct region click guesses as green
    if (geoQuizIdx !== -1 && quizGuesses[geoQuizIdx]) {
      defaultColor = RIGHT_ANSWER_COLOR;
      hoverColor = RIGHT_ANSWER_COLOR;
    }
  }

  let render = true;
  let onQuiz = filterRegions.includes(regionID);
  if (currentMap !== 'World') {
    render = onQuiz;
  } else {
    defaultColor = !regionOf && !onQuiz ? 'rgba(0, 104, 0, .05)' : defaultColor;
    strokeWidth = !isSelected && !regionOf && !onQuiz ? 0.01 : strokeWidth;
  }

  if (choropleth !== 'None' && !isQuizActive) {
    defaultColor = choroplethColor(choropleth, geo);
  }

  return {
    defaultColor,
    hoverColor,
    pressedColor,
    render,
    strokeWidth,
    strokeColor,
  };
};

export default ColorPicker;