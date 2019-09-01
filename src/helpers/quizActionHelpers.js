export const generateAnswerArray = filterRegions => {
  const quizAnswers = [...filterRegions];
  return quizAnswers.reduce((dum1, dum2, i) => {
    const j = Math.floor(Math.random() * (quizAnswers.length - i) + i);
    [quizAnswers[i], quizAnswers[j]] = [quizAnswers[j], quizAnswers[i]];
    return quizAnswers;
  }, quizAnswers);
};

export const generateQuizState = (quizAnswers, quizType) => ({
  quizAnswers,
  quizType,
  quiz: true,
  activeQuestionNum: 0,
  quizGuesses: [],
  selectedProperties: '',
  isTypeQuizActive: quizType.split('_')[0] === 'type',
});
