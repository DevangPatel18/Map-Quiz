import store from '../store';

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
  isQuizActive: true,
  activeQuestionNum: 0,
  quizGuesses: [],
  selectedProperties: '',
  isTypeQuizActive: quizType.split('_')[0] === 'type',
});

export const checkClickAnswer = ansGeoProperties => {
  const {
    activeQuestionNum,
    quizAnswers,
    selectedProperties,
  } = store.getState().quiz;
  const { regionKey } = store.getState().map;
  const isAnswerCorrect =
    ansGeoProperties[regionKey] === quizAnswers[activeQuestionNum];
  const newGeoProperties = isAnswerCorrect
    ? ansGeoProperties
    : selectedProperties;
  return { isAnswerCorrect, newGeoProperties };
};

export const checkIfQuizIncomplete = () => {
  const { activeQuestionNum, quizGuesses, quizAnswers } = store.getState().quiz;
  return (
    activeQuestionNum === quizGuesses.length &&
    quizGuesses.length < quizAnswers.length
  );
};
