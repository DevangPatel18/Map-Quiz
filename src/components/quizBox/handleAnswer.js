import removeDiacritics from '../../helpers/removeDiacritics';
import store from '../../store';

const simple = str =>
  removeDiacritics(str.toLowerCase())
    .replace(/\u002D/g, ' ')
    .replace(/[^\w\s]/g, '');

export default function handleAnswer(userGuess = null) {
  const {
    quizGuesses,
    quizAnswers,
    activeQuestionNum,
    quizType,
  } = this.state;
  const { geographyPaths } = store.getState().data;

  if (userGuess) {
    let result;

    const answerProperties = geographyPaths.find(
      geo => geo.properties.alpha3Code === quizAnswers[activeQuestionNum]
    ).properties;

    if (quizType.split('_')[1] === 'name') {
      result = answerProperties.spellings.some(
        name => simple(userGuess) === simple(name)
      );
    } else {
      result = simple(userGuess) === simple(answerProperties.capital);
    }

    const selectedProperties = result ? answerProperties : '';

    this.handleMapRefresh({
      selectedProperties,
      quizGuesses: [...quizGuesses, result],
      activeQuestionNum: activeQuestionNum + 1,
    });
  }
}
