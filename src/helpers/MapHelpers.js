import { choroplethColor } from './choroplethFunctions';
import store from '../store';

const RIGHT_ANSWER_COLOR = 'rgb(144, 238, 144)';
const WRONG_ANSWER_COLOR = 'rgb(255, 69, 0)';
const PROMPT_COLOR = 'rgb(255, 255, 0)';

export const checkRegionHide = geography => {
  const { filterRegions, currentMap, regionKey } = store.getState().map;
  const regionID = geography.properties[regionKey];
  const isRegionOnQuiz = filterRegions.includes(regionID);
  const isRegionHidden = currentMap !== 'World' ? !isRegionOnQuiz : false;
  return isRegionHidden;
};

export const colorPicker = geo => {
  const {
    isQuizActive,
    selectedProperties,
    infoTabShow,
  } = store.getState().quiz;
  const { regionKey, choropleth, defaultZoom } = store.getState().map;
  const isSelected =
    selectedProperties === geo.properties ? infoTabShow : false;
  const regionID = geo.properties[regionKey];
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

  let geoStyle = { defaultColor, hoverColor, pressedColor };
  let stroke = { strokeColor, strokeWidth };

  if (isQuizActive === true) {
    updateGeographyQuizStyle(regionID, geoStyle);
  }

  checkWorldViewHide(geo, isSelected, geoStyle, stroke);

  if (choropleth !== 'None' && !isQuizActive) {
    geoStyle.defaultColor = choroplethColor(choropleth, geo);
  }

  geoStyle = getGeoStyle(geoStyle);

  return { geoStyle, stroke };
};

export const updateGeographyQuizStyle = (regionID, geoStyle) => {
  const {
    quizGuesses,
    quizAnswers,
    isTypeQuizActive,
    activeQuestionNum,
  } = store.getState().quiz;
  const geoQuizIdx = quizAnswers.indexOf(regionID);

  // Fills region with name input request as yellow
  if (isTypeQuizActive && quizAnswers[activeQuestionNum] === regionID) {
    geoStyle.defaultColor = PROMPT_COLOR;
    geoStyle.hoverColor = PROMPT_COLOR;
  }

  // Fills status of region name guess, green for correct and red for incorrect
  if (isTypeQuizActive && quizGuesses[geoQuizIdx] !== undefined) {
    const answer = quizGuesses[geoQuizIdx][1]
      ? RIGHT_ANSWER_COLOR
      : WRONG_ANSWER_COLOR;
    geoStyle.defaultColor = answer;
    geoStyle.hoverColor = answer;
  }

  // Fills status of region click, green for correct and red for incorrect
  geoStyle.pressedColor =
    !isTypeQuizActive && regionID === quizAnswers[activeQuestionNum]
      ? RIGHT_ANSWER_COLOR
      : WRONG_ANSWER_COLOR;

  // Fills correct region click guesses as green
  if (geoQuizIdx !== -1 && quizGuesses[geoQuizIdx]) {
    geoStyle.defaultColor = RIGHT_ANSWER_COLOR;
    geoStyle.hoverColor = RIGHT_ANSWER_COLOR;
  }
};

export const checkWorldViewHide = (geography, isSelected, geoStyle, stroke) => {
  const { currentMap, filterRegions, regionKey } = store.getState().map;
  const { regionOf } = geography.properties;
  const regionID = geography.properties[regionKey];
  const onQuiz = filterRegions.includes(regionID);
  if (currentMap === 'World' && !regionOf && !onQuiz) {
    geoStyle.defaultColor = 'rgba(0, 104, 0, .05)';
    stroke.strokeWidth = !isSelected ? 0.01 : stroke.strokeWidth;
  }
};

export const getGeoStyle = ({ defaultColor, hoverColor, pressedColor }) => ({
  default: {
    fill: defaultColor,
    transition: 'fill .5s',
    outline: 'yellow',
  },
  hover: {
    fill: hoverColor,
    transition: 'fill .5s',
  },
  pressed: {
    fill: pressedColor,
    transition: 'fill .5s',
  },
});
