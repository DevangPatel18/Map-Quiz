import {
  scaleSequential,
  interpolateBlues,
  interpolateOranges,
  interpolatePiYG,
  interpolatePurples,
} from 'd3';

const popScale = scaleSequential(interpolateBlues).domain([0, 10]);

const areaScale = scaleSequential(interpolateOranges).domain([0, 17000000]);

const giniScale = scaleSequential(interpolatePiYG).domain([70, 20]);

const densityScale = scaleSequential(interpolatePurples).domain([0, 7]);

const ColorPicker = (state, geo) => {
  const {
    quiz,
    selectedProperties,
    quizGuesses,
    quizAnswers,
    disableInfoClick,
    activeQuestionNum,
    filterRegions,
    currentMap,
    choropleth,
  } = state;
  const isSelected = selectedProperties === geo.properties;
  let defaultColor = 'rgba(105, 105, 105, .3)';
  let hoverColor = 'rgba(105, 105, 105, .6)';
  let pressedColor = 'rgba(105, 105, 105, 1)';

  if (isSelected) {
    defaultColor = 'rgba(105, 105, 105, .8)';
    hoverColor = 'rgba(105, 105, 105, .8)';
  }

  if (quiz === true) {
    const geoQuizIdx = quizAnswers.indexOf(geo.properties.alpha3Code);

    // Fills country with name input request as yellow
    if (
      disableInfoClick &&
      quizAnswers[activeQuestionNum] === geo.properties.alpha3Code
    ) {
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
    if (
      !disableInfoClick &&
      geo.properties.alpha3Code !== quizAnswers[activeQuestionNum]
    ) {
      pressedColor = 'rgb(255, 69, 0)';
    }

    // Fills correct country clicks green
    if (
      !disableInfoClick &&
      geo.properties.alpha3Code === quizAnswers[activeQuestionNum]
    ) {
      pressedColor = 'rgb(94, 237, 94)';
    }

    // Fills correct country click guesses as green
    if (geoQuizIdx !== -1 && quizGuesses[geoQuizIdx]) {
      defaultColor = 'rgb(144, 238, 144)';
      hoverColor = 'rgb(144, 238, 144)';
    }
  }

  let render = true;
  if (currentMap !== 'world') {
    render = filterRegions.indexOf(geo.properties.alpha3Code) !== -1;
  }

  if (choropleth !== 'None') {
    switch (choropleth) {
      case 'Population':
        const population = geo.properties[choropleth.toLowerCase()];
        const popNum = [1, 5, 10, 20, 30, 40, 50, 100, 200, 1000, 1400].map(
          x => x * 1000000
        );
        const popIndex = popNum.findIndex(x => x > population);
        defaultColor = popScale(popIndex);
        break;
      case 'Area':
        defaultColor = areaScale(geo.properties[choropleth.toLowerCase()]);
        break;
      case 'Gini':
        const gini = geo.properties[choropleth.toLowerCase()];
        if (gini) {
          defaultColor = giniScale(gini);
        }
        break;
      case 'Density':
        const density = geo.properties['population'] / geo.properties['area'];
        const densityIndex = [25, 50, 75, 100, 200, 300, 1000, 27000];
        const index = densityIndex.findIndex(x => x > density);
        defaultColor = densityScale(index);
      default:
    }
  }

  return { defaultColor, hoverColor, pressedColor, render };
};

export default ColorPicker;
