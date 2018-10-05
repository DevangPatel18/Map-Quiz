import React, { Component } from 'react';
import './App.css';
import { feature } from 'topojson-client';
import WheelReact from 'wheel-react';
import { geoPath } from 'd3-geo';
import { geoTimes } from 'd3-geo-projection';
import { Button } from 'semantic-ui-react';
import InfoTab from './components/infoTab';
import {
  alpha3Codes,
  mapConfig,
} from './assets/regionAlpha3Codes';
import RegionButtons from './components/regionButtons';
import QuizBox from './components/quizBox';
import handleAnswer from './components/handleAnswer';
import handleInfoTabLoad from './components/handleInfoTabLoad';
import {
  handleQuizDataLoad,
  handleQuizState,
} from './components/handleQuizDataLoad';
import handleCountryClick from './components/handleCountryClick';
import handleDoubleClick from './components/handleDoubleClick';
import {
  DataFix,
  CountryMarkersFix,
  CapitalMarkersFix,
  SeparateRegions,
} from './helpers/attributeFix';
import capitalData from './assets/country_capitals';
import CountrySearch from './components/countrySearch';
import regionEllipses from './components/regionEllipses';
import countryLabels from './components/countryLabels';
import StatusBar from './components/statusBar';
import Map from './Map';

class App extends Component {
  constructor() {
    super();

    this.state = {
      center: [10, 0],
      defaultCenter: [10, 0],
      zoom: 1,
      defaultZoom: 1,
      scale: 210,
      dimensions: [980, 551],
      geographyPaths: [],
      selectedProperties: '',
      disableOptimization: false,
      filterRegions: [],
      quizAnswers: [],
      quizGuesses: [],
      quiz: false,
      quizType: null,
      activeQuestionNum: null,
      disableInfoClick: false,
      currentMap: 'world',
      time: 0,
      countryMarkers: [],
      capitalMarkers: [],
      fetchRequests: [],
      markerToggle: '',
    };

    WheelReact.config({
      left: () => {
        // console.log('wheel left detected.');
      },
      right: () => {
        // console.log('wheel right detected.');
      },
      up: () => {
        // console.log('wheel up detected.');
        this.handleZoom(0.5);
      },
      down: () => {
        // console.log('wheel down detected.');
        this.handleZoom(2);
      },
    });

    this.projection = this.projection.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleInfoTabLoad = handleInfoTabLoad.bind(this);
    this.handleQuizDataLoad = handleQuizDataLoad.bind(this);
    this.handleQuizState = handleQuizState.bind(this);
    this.handleCountryClick = handleCountryClick.bind(this);
    this.handleRegionSelect = this.handleRegionSelect.bind(this);
    this.handleQuiz = this.handleQuiz.bind(this);
    this.handleAnswer = handleAnswer.bind(this);
    this.handleQuizClose = this.handleQuizClose.bind(this);
    this.handleMapRefresh = this.handleMapRefresh.bind(this);
    this.handleDoubleClick = handleDoubleClick.bind(this);
    this.regionEllipses = regionEllipses.bind(this);
    this.countryLabels = countryLabels.bind(this);
  }

  componentDidMount() {
    this.loadPaths();
  }

  componentWillUnmount() {
    WheelReact.clearTimeout();
  }

  projection() {
    const { dimensions, scale } = this.state;
    return geoTimes()
      .translate(dimensions.map(x => x / 2))
      .scale(scale);
  }

  loadPaths() {
    fetch('/world-50m.json')
      .then((response) => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`);
          return;
        }
        response.json().then((worldData) => {
          fetch('https://restcountries.eu/rest/v2/all?fields=name;alpha3Code;alpha2Code;numericCode;area')
            .then((restCountries) => {
              if (restCountries.status !== 200) {
                console.log(`There was a problem: ${restCountries.status}`);
                return;
              }
              restCountries.json().then((restData) => {
                let data = feature(worldData, worldData.objects.countries).features;
                let countryMarkers = [];
                const capitalMarkers = [];

                // Remove Antarctica and invalid iso codes
                data = data.filter(x => (+x.id !== 10 ? 1 : 0));

                const essentialData = ['name', 'capital', 'alpha3Code', 'alpha2Code', 'area'];

                DataFix(data, restData, capitalMarkers);

                data.filter(x => ((+x.id !== -99) ? 1 : 0)).forEach((x) => {
                  const geography = x;
                  const countryData = restData.find(c => +c.numericCode === +geography.id);

                  essentialData.forEach((key) => { geography.properties[key] = countryData[key]; });

                  if (countryData.regionOf) {
                    geography.properties.regionOf = countryData.regionOf;
                  }

                  if (countryData.altSpellings) {
                    geography.properties.altSpellings = countryData.altSpellings;
                  }

                  const captemp = capitalData
                    .find(capital => capital.CountryCode === countryData.alpha2Code);
                  if (captemp) {
                    const capitalCoords = [+captemp.CapitalLongitude, +captemp.CapitalLatitude];

                    capitalMarkers.push({
                      name: countryData.capital,
                      alpha3Code: countryData.alpha3Code,
                      coordinates: capitalCoords,
                      markerOffset: -7,
                    });
                  }
                });

                SeparateRegions(data);

                data.forEach((x) => {
                  const { alpha3Code } = x.properties;
                  const path = geoPath().projection(this.projection());
                  countryMarkers.push([this.projection().invert(path.centroid(x)), alpha3Code]);
                });

                countryMarkers = countryMarkers.map(array => ({
                  name: data.find(x => x.properties.alpha3Code === array[1]).properties.name,
                  alpha3Code: array[1],
                  coordinates: array[0],
                  markerOffset: 0,
                }));
                CountryMarkersFix(countryMarkers);
                CapitalMarkersFix(capitalMarkers);

                this.setState({ geographyPaths: data, countryMarkers, capitalMarkers });
              });
            });
        });
      });
  }

  handleZoom(x) {
    const { zoom } = this.state;
    this.setState({
      zoom: zoom * x,
    });
  }

  handleReset() {
    const { defaultCenter, defaultZoom } = this.state;
    this.setState({
      center: [defaultCenter[0], defaultCenter[1] + Math.random() / 1000],
      zoom: defaultZoom,
    });
  }

  handleMoveStart(currentCenter) {
    // console.log("Current center: ", currentCenter)
  }

  handleMoveEnd(newCenter) {
    // console.log("New center: ", newCenter)
  }

  handleRegionSelect(region) {
    const { center, zoom } = mapConfig[region];
    this.handleMapRefresh({
      zoom,
      center,
      defaultZoom: zoom,
      defaultCenter: center,
      currentMap: region,
      filterRegions: alpha3Codes[region],
      selectedProperties: '',
    });
  }

  handleQuiz(quizType) {
    const { currentMap, fetchRequests } = this.state;
    if ((quizType === 'click_name')
      || fetchRequests.includes(currentMap.concat(quizType.split('_')[1]))) {
      this.handleQuizState(quizType);
    } else {
      this.handleQuizDataLoad(quizType);
    }
  }

  handleQuizClose() {
    this.handleMapRefresh({
      quizAnswers: [],
      quizGuesses: [],
      quiz: false,
      quizType: null,
      activeQuestionNum: null,
      disableInfoClick: false,
      selectedProperties: '',
      time: 0,
    });
  }

  handleMapRefresh(args) {
    this.setState({ ...args, disableOptimization: true },
      () => { this.setState({ disableOptimization: false }); });
  }

  render() {
    const {
      filterRegions, quiz, quizAnswers, quizGuesses, geographyPaths, activeQuestionNum,
      selectedProperties, time, fetchRequests, currentMap,
    } = this.state;

    if (quizGuesses.length === quizAnswers.length) {
      clearInterval(this.timer);
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Country Data</h1>
        </header>

        <div className="zoomButtons">
          <Button.Group size="tiny" basic vertical>
            <Button onClick={() => this.handleZoom(2)} icon="plus" />
            <Button onClick={() => this.handleZoom(0.5)} icon="minus" />
            <Button onClick={this.handleReset} icon="undo" />
          </Button.Group>
        </div>

        <QuizBox
          visible={filterRegions.length !== 0}
          nonactive={!quiz}
          handleQuiz={(quizType) => { this.handleQuiz(quizType); }}
          closequiz={this.handleQuizClose}
          quizData={{
            quizAnswers, quizGuesses, geographyPaths, activeQuestionNum, fetchRequests, currentMap,
          }}
          handleAnswer={this.handleAnswer}
          markerToggle={(marker) => { this.setState({ markerToggle: marker }); }}
          loadData={(...args) => { this.handleQuizDataLoad(...args); }}
        />

        <div
          className="dropDownSelections"
          style={quiz ? { top: '-5em' } : null}
        >
          <CountrySearch
            projection={this.projection}
            state={this.state}
            mapRefresh={(arg) => { this.handleMapRefresh(arg); }}
          />
          <RegionButtons regionFunc={this.handleRegionSelect} />
        </div>

        <StatusBar
          status={{
            quiz, quizGuesses, quizAnswers, time,
          }}
        />

        <InfoTab
          country={selectedProperties}
          geoPaths={geographyPaths}
          loadData={(geo) => { this.handleInfoTabLoad(geo); }}
        />

        <div {...WheelReact.events}>
          <Map appthis={this} />
        </div>
        <footer><div>Copyright © 2018 Devang Patel. All rights reserved.</div></footer>
      </div>
    );
  }
}

export default App;
