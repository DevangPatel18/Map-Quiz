import { choroplethColor } from '../helpers/choroplethFunctions';
import store from '../store';

const ColorPicker = geo => {
  const {
    quiz,
    quizGuesses,
    quizAnswers,
    disableInfoClick,
    activeQuestionNum,
    selectedProperties,
  } = store.getState().quiz;
  const { filterRegions, currentMap, choropleth } = store.getState().map;
  const isSelected = selectedProperties === geo.properties;
  const { alpha3Code } = geo.properties;
  let defaultColor = 'rgba(105, 105, 105, .3)';
  let hoverColor = 'rgba(105, 105, 105, .6)';
  let pressedColor = 'rgba(105, 105, 105, 1)';

  if (isSelected) {
    defaultColor = 'rgba(105, 105, 105, .8)';
    hoverColor = 'rgba(105, 105, 105, .8)';
  }

  if (quiz === true) {
    const geoQuizIdx = quizAnswers.indexOf(alpha3Code);

    // Fills country with name input request as yellow
    if (disableInfoClick && quizAnswers[activeQuestionNum] === alpha3Code) {
      defaultColor = 'rgb(255, 255, 0)';
      hoverColor = 'rgb(255, 255, 0)';
    }

    // Fills correct status of country name guess, green for correct and red for incorrect
    if (disableInfoClick) {
      if (quizGuesses[geoQuizIdx] !== undefined) {
        const answer = quizGuesses[geoQuizIdx][1]
          ? 'rgb(144, 238, 144)'
          : 'rgb(255, 69, 0)';
        defaultColor = answer;
        hoverColor = answer;
      }
    }

    // Fills incorrect country clicks red
    if (!disableInfoClick && alpha3Code !== quizAnswers[activeQuestionNum]) {
      pressedColor = 'rgb(255, 69, 0)';
    }

    // Fills correct country clicks green
    if (!disableInfoClick && alpha3Code === quizAnswers[activeQuestionNum]) {
      pressedColor = 'rgb(94, 237, 94)';
    }

    // Fills correct country click guesses as green
    if (geoQuizIdx !== -1 && quizGuesses[geoQuizIdx]) {
      defaultColor = 'rgb(144, 238, 144)';
      hoverColor = 'rgb(144, 238, 144)';
    }
  }

  let render = true;
  let strokeWidth = 0.05;
  let onQuiz = filterRegions.indexOf(alpha3Code) !== -1;
  if (currentMap !== 'World') {
    render = onQuiz;
  } else {
    defaultColor = !onQuiz ? 'rgba(105, 105, 105, .05)' : defaultColor;
    strokeWidth = !onQuiz ? 0.01 : strokeWidth;
  }

  if (choropleth !== 'None' && !quiz) {
    defaultColor = choroplethColor(choropleth, geo, defaultColor);
  }

  return { defaultColor, hoverColor, pressedColor, render, strokeWidth };
};

export default ColorPicker;
