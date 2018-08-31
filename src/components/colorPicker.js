const ColorPicker = (state, geo) => {
  
  let isSelected = state.selectedProperties === geo.properties
  let defaultColor, hoverColor;

  defaultColor = "rgba(105, 105, 105, .3)";
  hoverColor = "rgba(105, 105, 105, .6)";

  if(isSelected) {
    defaultColor = "rgba(105, 105, 105, .8)";
    hoverColor = "rgba(105, 105, 105, .8)";
  }

  if(state.quiz === true){
    let geoQuizIdx = state.quizAnswers.indexOf(geo.properties.alpha3Code)

    // Fills country with name input request as yellow
    if(state.disableInfoClick && state.quizAnswers[state.activeQuestionNum] === geo.properties.alpha3Code) {
      defaultColor = "rgb(255, 255, 0)"
      hoverColor = "rgb(255, 255, 0)"
    }

    // Fills correct status of country name guess, green for correct and red for incorrect
    if(state.disableInfoClick){
      if(state.quizGuesses[geoQuizIdx] !== undefined) {
        let answer = state.quizGuesses[geoQuizIdx][1] ? "rgb(144, 238, 144)": "rgb(255, 69, 0)"
        defaultColor = answer
        hoverColor = answer
      }
    }

    // Fills correct country click guesses as green
    if(geoQuizIdx !== -1 && state.quizGuesses[geoQuizIdx] === state.quizAnswers[geoQuizIdx]) {
      defaultColor = "rgb(144, 238, 144)"
      hoverColor = "rgb(144, 238, 144)"
    }
  }

  let render = true
  if(state.filterRegions.length !== 0) {
    render = state.filterRegions.indexOf(geo.properties["alpha3Code"]) !== -1
  }

  return [defaultColor, hoverColor, render]
}

export default ColorPicker