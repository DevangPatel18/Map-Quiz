import { choroplethColor } from '../helpers/choroplethFunctions';
import store from '../store';

const RIGHT_ANSWER_COLOR = 'rgb(144, 238, 144)';
const WRONG_ANSWER_COLOR = 'rgb(255, 69, 0)';
const PROMPT_COLOR = 'rgb(255, 255, 0)';

const ColorPicker = geo => {
  const {
    quiz,
    quizGuesses,
    quizAnswers,
    disableInfoClick,
    activeQuestionNum,
    selectedProperties,
    infoTabShow,
  } = store.getState().quiz;
  const { filterRegions, currentMap, choropleth } = store.getState().map;
  const isSelected =
    selectedProperties === geo.properties ? infoTabShow : false;
  const { alpha3Code } = geo.properties;
  let defaultColor = 'rgb(0, 140, 0)';
  let hoverColor = 'rgb(0, 120, 0)';
  let pressedColor = 'rgb(0, 70, 0)';

  if (isSelected) {
    defaultColor = 'rgb(0, 100, 0)';
    hoverColor = 'rgb(0, 100, 0)';
  }

  if (quiz === true) {
    const geoQuizIdx = quizAnswers.indexOf(alpha3Code);

    // Fills country with name input request as yellow
    if (disableInfoClick && quizAnswers[activeQuestionNum] === alpha3Code) {
      defaultColor = PROMPT_COLOR;
      hoverColor = PROMPT_COLOR;
    }

    // Fills correct status of country name guess, green for correct and red for incorrect
    if (disableInfoClick) {
      if (quizGuesses[geoQuizIdx] !== undefined) {
        const answer = quizGuesses[geoQuizIdx][1]
          ? RIGHT_ANSWER_COLOR
          : WRONG_ANSWER_COLOR;
        defaultColor = answer;
        hoverColor = answer;
      }
    }

    // Fills incorrect country clicks red
    if (!disableInfoClick && alpha3Code !== quizAnswers[activeQuestionNum]) {
      pressedColor = WRONG_ANSWER_COLOR;
    }

    // Fills correct country clicks green
    if (!disableInfoClick && alpha3Code === quizAnswers[activeQuestionNum]) {
      pressedColor = RIGHT_ANSWER_COLOR;
    }

    // Fills correct country click guesses as green
    if (geoQuizIdx !== -1 && quizGuesses[geoQuizIdx]) {
      defaultColor = RIGHT_ANSWER_COLOR;
      hoverColor = RIGHT_ANSWER_COLOR;
    }
  }

  let render = true;
  let strokeWidth = 0.05;
  let onQuiz = filterRegions.indexOf(alpha3Code) !== -1;
  if (currentMap !== 'World') {
    render = onQuiz;
  } else {
    defaultColor = !onQuiz ? 'rgba(0, 104, 0, .05)' : defaultColor;
    strokeWidth = !onQuiz ? 0.01 : strokeWidth;
  }

  if (choropleth !== 'None' && !quiz) {
    defaultColor = choroplethColor(choropleth, geo);
  }

  return { defaultColor, hoverColor, pressedColor, render, strokeWidth };
};

export default ColorPicker;
