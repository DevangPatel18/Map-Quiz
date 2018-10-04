export default function handleCountryClick(geo) {
  const {
    disableInfoClick, activeQuestionNum, quizGuesses, quizAnswers,
  } = this.state;
  if (!disableInfoClick) {
    if (activeQuestionNum === quizGuesses.length) {
      const result = geo.properties.alpha3Code === quizAnswers[activeQuestionNum];
      this.handleMapRefresh({
        quizGuesses: [...quizGuesses, result],
        selectedProperties: geo.properties,
        activeQuestionNum: activeQuestionNum + 1,
      });
    } else {
      const selectedProperties = this.state.selectedProperties.name !== geo.properties.name ? geo.properties : '';
      this.handleMapRefresh({ selectedProperties });
    }
  }
}
