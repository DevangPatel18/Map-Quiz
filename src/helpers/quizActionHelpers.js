import store from '../store';

import removeDiacritics from '../helpers/removeDiacritics';

const simple = str =>
  removeDiacritics(str.toLowerCase())
    .replace(/\u002D/g, ' ')
    .replace(/[^\w\s]/g, '');

export const getRegionIdsForQuiz = () => {
  const { filterRegions, currentMap } = store.getState().map;
  const { mapViewCountryIds } = store.getState().data;
  const { areExternalRegionsOnQuiz } = store.getState().quiz;
  if (currentMap !== 'World' && !areExternalRegionsOnQuiz) {
    return mapViewCountryIds[currentMap] || filterRegions;
  }
  return filterRegions;
};

export const generateAnswerArray = quizRegionIds => {
  const quizAnswers = [...quizRegionIds];
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

export const checkTypeAnswer = userGuess => {
  const { quizAnswers, activeQuestionNum, quizType } = store.getState().quiz;
  const { geographyPaths } = store.getState().data;
  const { regionKey } = store.getState().map;

  const answerProperties = geographyPaths.find(
    geo => geo.properties[regionKey] === quizAnswers[activeQuestionNum]
  ).properties;

  const isAnswerCorrect =
    quizType.split('_')[1] === 'name'
      ? answerProperties.spellings.some(
          name => simple(userGuess) === simple(name)
        )
      : simple(userGuess) === simple(answerProperties.capital);

  const newGeoProperties = isAnswerCorrect ? answerProperties : '';

  return { isAnswerCorrect, newGeoProperties };
};

export const checkIfQuizIncomplete = () => {
  const { activeQuestionNum, quizGuesses, quizAnswers } = store.getState().quiz;
  return (
    activeQuestionNum === quizGuesses.length &&
    quizGuesses.length < quizAnswers.length
  );
};
