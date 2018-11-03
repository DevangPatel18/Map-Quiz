import React, { Component } from 'react';
import WheelReact from 'wheel-react';
import { geoTimes } from 'd3-geo-projection';
import { Button } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import InfoTab from './components/infoTab/infoTab';
import RegionButtons from './components/regionButtons';
import QuizBox from './components/quizBox/quizBox';
import handleAnswer from './components/quizBox/handleAnswer';
import handleInfoTabLoad from './components/infoTab/handleInfoTabLoad';
import {
  handleQuizDataLoad,
  handleQuizState,
} from './components/quizBox/handleQuizDataLoad';
import handleCountryClick from './components/handleCountryClick';
import handleDoubleClick from './components/handleDoubleClick';
import handleRegionSelect from './components/handleRegionSelect';
import CountrySearch from './components/countrySearch';
import regionEllipses from './components/regionEllipses';
import countryLabels from './components/countryLabels';
import StatusBar from './components/statusBar/statusBar';
import loadPaths from './components/loadPaths';
import MobileMessage from './components/mobileMessage';
import { alpha3CodesSov } from './assets/regionAlpha3Codes';
import ChoroplethToggles from './components/ChoroplethToggles';

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
      countryMarkers: [],
      capitalMarkers: [],
      fetchRequests: [],
      markerToggle: '',
      checkedRegions: {
        'North & Central America': true,
        'South America': true,
        Caribbean: true,
        Europe: true,
        Africa: true,
        Asia: true,
        Oceania: true,
      },
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
    this.handleRegionSelect = handleRegionSelect.bind(this);
    this.handleQuiz = this.handleQuiz.bind(this);
    this.handleAnswer = handleAnswer.bind(this);
    this.handleQuizClose = this.handleQuizClose.bind(this);
    this.handleMapRefresh = this.handleMapRefresh.bind(this);
    this.handleDoubleClick = handleDoubleClick.bind(this);
    this.regionEllipses = regionEllipses.bind(this);
    this.countryLabels = countryLabels.bind(this);
    this.loadPaths = loadPaths.bind(this);
    this.toggleOrientation = this.toggleOrientation.bind(this);
    this.adjustMapSize = this.adjustMapSize.bind(this);
    this.setQuizRegions = this.setQuizRegions.bind(this);
  }

  componentDidMount() {
    this.loadPaths();
    window.addEventListener("orientationchange", this.toggleOrientation);
    window.addEventListener("resize", this.adjustMapSize);

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (isMobile) {
      const dimensions = height > width ? [310, 551] : [980, 551];
      this.setState({ dimensions });
    } else {
      this.adjustMapSize()
    }
  }

  componentWillUnmount() {
    WheelReact.clearTimeout();
    window.removeEventListener("orientationchange", this.toggleOrientation);
    window.removeEventListener("resize", this.adjustMapSize);
  }

  projection() {
    const { dimensions, scale } = this.state;
    return geoTimes()
      .translate(dimensions.map(x => x / 2))
      .scale(scale);
  }

  toggleOrientation() {
    const { dimensions } = this.state;
    const newDimensions = dimensions[0] === 310 ? [980, 551] : [310, 551];
    this.handleMapRefresh({ dimensions: newDimensions });
  }

  adjustMapSize() {
    const { dimensions } = this.state;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = width / height;
    let newDimensions;
    if (ratio > 1.43) {
      newDimensions = [980, 551]
    } else if (ratio > .85) {
      newDimensions = [645, 551]
    } else {
      newDimensions = [420, 551]
    }
    if (newDimensions[0] !== dimensions[0]) {
      this.handleMapRefresh({ dimensions: newDimensions });
    }
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
    });
  }

  handleMapRefresh(args) {
    this.setState({ ...args, disableOptimization: true },
      () => { this.setState({ disableOptimization: false }); });
  }

  setQuizRegions(value = null, checked = null) {
    this.setState(
      prevState => {
        let checkedRegions = {...prevState.checkedRegions};
        if (value) {
          checkedRegions[value] = !checkedRegions[value];
        }

        const filterRegions = Object.keys(checkedRegions)
          .filter(region => checkedRegions[region])
          .map(region => alpha3CodesSov[region])
          .reduce((a,b) => a.concat(b), []);
        return { checkedRegions, filterRegions };
      }
    );
  }

  render() {
    const {
      quiz, quizAnswers, quizGuesses, geographyPaths, activeQuestionNum,
      selectedProperties, fetchRequests, currentMap, markerToggle,
      checkedRegions,
    } = this.state;

    const footerStyle = isMobile ? { fontSize: '10px' } : {};

    return (
      <div className="App">
        {!quiz && (
          <header className="App-header">
            <h1 className="App-title">Map Quiz</h1>
          </header>)
        }

        {isMobile && <MobileMessage/>}

        <div className="zoomButtons">
          <Button.Group size="tiny" basic vertical>
            <Button onClick={() => this.handleZoom(2)} icon="plus" />
            <Button onClick={() => this.handleZoom(0.5)} icon="minus" />
            <Button onClick={this.handleReset} icon="undo" />
          </Button.Group>
        </div>

        <QuizBox
          handleQuiz={(quizType) => { this.handleQuiz(quizType); }}
          quizData={{
            quizAnswers, quizGuesses, geographyPaths, activeQuestionNum,
            fetchRequests, currentMap, markerToggle, checkedRegions, quiz,
          }}
          handleAnswer={this.handleAnswer}
          setToggle={(marker) => { this.setState({ markerToggle: marker }); }}
          loadData={(...args) => { this.handleQuizDataLoad(...args); }}
          setQuizRegions={(obj) => { this.setQuizRegions(obj)}}
          closeQuiz={this.handleQuizClose}
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
          status={{ quiz, quizGuesses, quizAnswers }}
        />

        <InfoTab
          country={selectedProperties}
          geoPaths={geographyPaths}
          loadData={(geo) => { this.handleInfoTabLoad(geo); }}
        />

        <ChoroplethToggles/>

        <div {...WheelReact.events}>
          <Map appthis={this} />
        </div>
        <footer><div style={footerStyle}>Copyright © 2018 Devang Patel. All rights reserved.</div></footer>
      </div>
    );
  }
}

export default App;
