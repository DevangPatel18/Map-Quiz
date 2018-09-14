export default function handleCountryClick(geo){
  if(!this.state.disableInfoClick) {
    if(this.state.activeQuestionNum === this.state.quizGuesses.length) {
      let result = geo.properties["alpha3Code"] === this.state.quizAnswers[this.state.activeQuestionNum]
      this.handleMapRefresh({
        quizGuesses: [...this.state.quizGuesses, result],
        selectedProperties: geo.properties,
        viewInfoDiv: true
      })
    } else {
      this.setState({ viewInfoDiv: !this.state.viewInfoDiv }
      , () => {
        let selectedProperties = this.state.selectedProperties !== geo.properties ? geo.properties : "";
        let viewInfoDiv = selectedProperties !== "";
        setTimeout(() => {
          this.handleMapRefresh({ selectedProperties, viewInfoDiv })
        }, this.state.infoDuration)
      })
    }
  }
}
