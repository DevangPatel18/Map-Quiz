export default function handleCountryClick(geo){
  if(!this.state.disableInfoClick) {
    if(this.state.activeQuestionNum === this.state.quizGuesses.length) {
      let result = geo.properties["alpha3Code"] === this.state.quizAnswers[this.state.activeQuestionNum]
      this.setState(prevState => ({
          quizGuesses: [...prevState.quizGuesses, result],
          disableOptimization: true,
          selectedProperties: geo.properties,
          viewInfoDiv: true
        }), () => { this.setState({ disableOptimization: false }) }
      )
    } else {
      this.setState(prevState => ({
        disableOptimization: true,
        viewInfoDiv: !prevState.viewInfoDiv,
        }), () => {
          let selectedProperties = this.state.selectedProperties !== geo.properties ? geo.properties : "";
          let viewInfoDiv = selectedProperties !== "";
          setTimeout(() => {
            this.setState({
              disableOptimization: false,
              selectedProperties,
              viewInfoDiv
              }, this.handleMapRefresh)
            }, this.state.infoDuration)
      })
    }
  }
}
