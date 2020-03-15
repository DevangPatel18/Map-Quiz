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
  const { isQtnFixed } = store.getState().quiz;
  if (!isQtnFixed) return quizRegionIds;
  const quizAnswers = [...quizRegionIds];
  return quizAnswers.reduce((dum1, dum2, i) => {
    const j = Math.floor(Math.random() * (quizAnswers.length - i) + i);
    [quizAnswers[i], quizAnswers[j]] = [quizAnswers[j], quizAnswers[i]];
    return quizAnswers;
  }, quizAnswers);
};

export const checkClickAnswer = ansGeoProperties => {
  const { quizIdx, quizAnswers, selectedProperties } = store.getState().quiz;
  const isAnswerCorrect = ansGeoProperties.regionID === quizAnswers[quizIdx];
  const newGeoProperties = isAnswerCorrect
    ? ansGeoProperties
    : selectedProperties;
  return { isAnswerCorrect, newGeoProperties };
};

export const checkTypeAnswer = userGuess => {
  const { quizAnswers, isQtnFixed } = store.getState().quiz;
  const { geographyPaths } = store.getState().data;
  const filteredGeoPaths = geographyPaths.filter(
    ({ properties }) =>
      Object.keys(properties).length !== 0 &&
      quizAnswers.includes(properties.regionID)
  );

  return isQtnFixed
    ? checkTypeAnswerOrdered(userGuess, filteredGeoPaths)
    : checkTypeAnswerUnordered(userGuess, filteredGeoPaths);
};

const checkTypeAnswerOrdered = (userGuess, filteredGeoPaths) => {
  const { quizAnswers, quizIdx } = store.getState().quiz;
  let newGeoProperties = filteredGeoPaths.find(
    geo => geo.properties.regionID === quizAnswers[quizIdx]
  ).properties;
  const isAnswerCorrect = checkValidSpelling(userGuess, newGeoProperties);
  newGeoProperties = isAnswerCorrect ? newGeoProperties : '';
  return { isAnswerCorrect, newGeoProperties };
};

const checkTypeAnswerUnordered = (userGuess, filteredGeoPaths) => {
  const { quizAnswers, quizGuesses } = store.getState().quiz;
  const answeredRegions = quizAnswers.filter((__, idx) => quizGuesses[idx]);
  let isAnswerCorrect, newGeoProperties;
  filteredGeoPaths
    .filter(({ properties }) => !answeredRegions.includes(properties.regionID))
    .some(({ properties }) => {
      isAnswerCorrect = checkValidSpelling(userGuess, properties);
      if (isAnswerCorrect) {
        newGeoProperties = properties;
        return true;
      }
      return false;
    });
  return { isAnswerCorrect, newGeoProperties };
};

const checkValidSpelling = (userGuess, regionObj) => {
  const { regionClass } = store.getState().quiz;
  return regionClass === 'name'
    ? regionObj.spellings.some(name => simple(userGuess) === simple(name))
    : simple(userGuess) === simple(regionObj.capital);
};

export const checkIfQuizIncomplete = () => {
  const { quizIdx, quizGuesses, quizAnswers } = store.getState().quiz;
  return (
    quizIdx === quizGuesses.length && quizGuesses.length < quizAnswers.length
  );
};

export const removeQuizExceptions = quizAnswers => {
  const { currentMap } = store.getState().map;
  const { quizType, regionClass } = store.getState().quiz;
  let newQuizAnswers = [...quizAnswers];
  let removedAnswers = null;
  switch (currentMap) {
    case 'Asia':
      if (regionClass === 'capital') {
        removedAnswers = ['MAC', 'HKG'];
      }
      break;
    case 'United States of America':
      if (regionClass !== 'flag') {
        removedAnswers = ['DC'];
      }
      break;
    case 'India':
      if (quizType === 'click_capital') {
        removedAnswers = ['IN.PB', 'IN.HR', 'IN.CH'];
      }
      break;
    case 'Germany':
      if (regionClass === 'capital') {
        removedAnswers = ['DE.BE', 'DE.HB', 'DE.HH'];
      }
      break;
    case 'France':
      if (regionClass === 'flag') {
        removedAnswers = ['FR.AO', 'FR.IF', 'FR.PL'];
      }
      break;
    case 'Japan':
      if (regionClass === 'capital') {
        removedAnswers = ['JP,TK'];
      }
      break;
    default:
  }
  return removedAnswers
    ? newQuizAnswers.filter(x => !removedAnswers.includes(x))
    : newQuizAnswers;
};
