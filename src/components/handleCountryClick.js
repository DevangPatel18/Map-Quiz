export default function handleCountryClick(geo) {
  const {
    disableInfoClick,
    activeQuestionNum,
    quizGuesses,
    quizAnswers,
  } = this.state;
  if (!disableInfoClick) {
    if (activeQuestionNum === quizGuesses.length && quizGuesses.length < quizAnswers.length) {
      const result =
        geo.properties.alpha3Code === quizAnswers[activeQuestionNum];
      const selectedProperties = result ? geo.properties : '';
      this.handleMapRefresh({
        selectedProperties,
        quizGuesses: [...quizGuesses, result],
        activeQuestionNum: activeQuestionNum + 1,
      });
    } else {
      const selectedProperties =
        this.state.selectedProperties.name !== geo.properties.name
          ? geo.properties
          : '';
      this.handleMapRefresh({ selectedProperties });
    }
  }
}
