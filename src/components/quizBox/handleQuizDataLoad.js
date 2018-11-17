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
}

function handleQuizDataLoad(quizType) {
  const { currentMap, filterRegions } = this.state;
  const testing = quizType.split('_')[1];
  const home = 'https://restcountries.eu/rest/v2/';
  const formFields = '?fields=alpha3Code;';
  const urls = [];

  if (currentMap === 'world') {
    urls.push(`${home}all`);
  } else if (['Africa', 'Europe', 'Oceania'].includes(currentMap)) {
    urls.push(`${home}region/${currentMap}`);
  } else if (currentMap === 'Asia') {
    urls.push(`${home}region/${currentMap}`);
    urls.push(`${home}alpha/rus`);
  } else if (['South America', 'Caribbean'].includes(currentMap)) {
    urls.push(`${home}subregion/${currentMap}`);
  } else {
    urls.push(`${home}subregion/Central America`);
    urls.push(`${home}alpha/can`);
    urls.push(`${home}alpha/usa`);
  }

  urls.map(url => {
    switch (testing) {
      case 'name':
        return `${url}${formFields}altSpellings;translations`;
      default:
        console.log('Invalid input ', testing);
        return null;
    }
  });

  Promise.all(
    urls.map(url => fetch(url).then(restCountry => restCountry.json()))
  )
    .then(data =>
      data.reduce((array, a) => {
        if (Array.isArray(a)) {
          return array.concat(a);
        }
        array.push(a);
        return array;
      }, [])
    )
    .then(restCountryData => {
      this.setState(
        prevState => {
          const newFetchRequests = [
            ...prevState.fetchRequests,
            currentMap.concat(testing),
          ];
          const geographyPaths = prevState.geographyPaths.map(geography => {
            if (filterRegions.includes(geography.properties.alpha3Code)) {
              const newGeo = Object.assign({}, geography);
              if (quizType === 'type_name') {
                const { translations, altSpellings } = restCountryData.find(
                  obj => obj.alpha3Code === geography.properties.alpha3Code
                );
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

          return { geographyPaths, fetchRequests: newFetchRequests };
        },
        () => {
          this.handleQuizState(quizType);
        }
      );
    });
}

export { handleQuizState, handleQuizDataLoad };
