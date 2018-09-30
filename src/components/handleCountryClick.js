export default function handleCountryClick(geo){
  if(!this.state.disableInfoClick) {
    if(this.state.activeQuestionNum === this.state.quizGuesses.length) {
      let result = geo.properties["alpha3Code"] === this.state.quizAnswers[this.state.activeQuestionNum]
      this.handleMapRefresh({
        quizGuesses: [...this.state.quizGuesses, result],
        selectedProperties: geo.properties,
        activeQuestionNum: this.state.activeQuestionNum + 1,
      })
    } else {
      let selectedProperties = this.state.selectedProperties !== geo.properties ? geo.properties : "";
      this.handleMapRefresh({ selectedProperties })
    }
  }
}
