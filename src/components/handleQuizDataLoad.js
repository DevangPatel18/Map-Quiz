function handleQuizState(quizType) {
  const { filterRegions } = this.state;
  const quizAnswers = [...filterRegions];
  quizAnswers.reduce((dum1, dum2, i) => {
    const j = Math.floor(Math.random() * (quizAnswers.length - i) + i);
    [quizAnswers[i], quizAnswers[j]] = [quizAnswers[j], quizAnswers[i]];
    return quizAnswers;
  }, quizAnswers);

  this.handleMapRefresh({
    quizAnswers,
    quizType,
    quiz: true,
    activeQuestionNum: 0,
    quizGuesses: [],
    selectedProperties: '',
    disableInfoClick: quizType.split('_')[0] === 'type',
  });

  const x = Date.now();
  this.timer = setInterval(() => this.setState({ time: Date.now() - x }), 100);
}

function handleQuizDataLoad(quizType) {
  const { currentMap, filterRegions } = this.state;
  const url = 'https://restcountries.eu/rest/v2/';
  let formFields = '?fields=alpha3Code;';
  let regionLink;

  if (['Africa', 'Europe', 'Asia', 'Oceania'].includes(currentMap)) {
    regionLink = `region/${currentMap}`;
  } else {
    regionLink = `subregion/${currentMap}`;
  }

  if (quizType === 'type_name') {
    formFields += 'altSpellings;translations';
  } else if (quizType.split('_')[1] === 'capital') {
    formFields += 'capital';
  } else if (quizType === 'click_flag') {
    formFields += 'flag';
  }

  regionLink = url + regionLink + formFields;
  fetch(regionLink)
    .then(restCountry => restCountry.json())
    .then((restCountryData) => {
      this.setState((prevState) => {
        const newFetchRequests = [...prevState.fetchRequests, currentMap.concat(quizType.split('_')[1])];
        const geographyPaths = prevState.geographyPaths
          .map((geography) => {
            if (filterRegions.includes(geography.properties.alpha3Code)) {
              const newGeo = Object.assign({}, geography);
              if ((quizType.split('_')[1] === 'capital' && !geography.properties.capital)
                || (quizType === 'click_flag' && !geography.properties.flag)) {
                newGeo.properties[quizType.split('_')[1]] = restCountryData
                  .find(obj => obj.alpha3Code === geography.properties.alpha3Code)[quizType.split('_')[1]];
              } else if (quizType === 'type_name') {
                const { translations, altSpellings } = restCountryData
                  .find(obj => obj.alpha3Code === geography.properties.alpha3Code);
                altSpellings.shift();
                if (geography.properties.altSpellings) {
                  altSpellings.push(geography.properties.altSpellings[0]);
                }
                newGeo.properties.spellings = [
                  ...new Set([
                    geography.properties.name,
                    ...altSpellings,
                    ...Object.values(translations).filter(x => x),
                  ]),
                ];
              }
              return newGeo;
            }
            return geography;
          });

        if (quizType.split('_')[1] === 'capital') {
          const capitalMarkers = prevState.capitalMarkers
            .map((marker) => {
              if (filterRegions.includes(marker.alpha3Code)) {
                const newMark = Object.assign({}, marker);
                newMark.name = restCountryData
                  .find(obj => obj.alpha3Code === marker.alpha3Code).capital;
                return newMark;
              }
              return marker;
            });
          return { geographyPaths, capitalMarkers, newFetchRequests };
        }
        return { geographyPaths, newFetchRequests };
      }, () => { this.handleQuizState(quizType); });
    });
}

export { handleQuizState, handleQuizDataLoad };
