import React, { Component } from 'react';
import './App.css';
import { feature } from "topojson-client"
import WheelReact from 'wheel-react';
import countryData from "./assets/country_data.json"
import InfoTab from "./components/infoTab.js"
import { alpha3Codes, mapConfig } from "./assets/regionAlpha3Codes.js"
import RegionButtons from "./components/regionButtons.js"
import QuizBox from "./components/quizBox.js"
import handleAnswer from "./components/handleAnswer.js"
import handleCountryClick from "./components/handleCountryClick.js"
import handleDoubleClick from "./components/handleDoubleClick.js"
import { geoPath } from "d3-geo"
import { geoTimes } from "d3-geo-projection"
import { DataFix, MarkersFix, SeparateRegions } from "./helpers/attributeFix.js"
import capitalData from "./assets/country_capitals.json"
import { Button } from "semantic-ui-react"
import CountrySearch from "./components/countrySearch.js"
import regionEllipses from "./components/regionEllipses.js"
import countryLabels from "./components/countryLabels.js"
import statusBar from "./components/statusBar.js"
import Map from "./Map.js"

class App extends Component {
  constructor() {
    super()

    this.state = {
      center: [10,0],
      defaultCenter: [10,0],
      zoom: 1,
      defaultZoom: 1,
      scale: 210,
      dimensions: [980,551],
      geographyPaths: [],
      selectedProperties: "",
      disableOptimization: false,
      filterRegions: [],
      quizAnswers: [],
      quizGuesses: [],
      quiz: false,
      quizType: null,
      activeQuestionNum: null,
      disableInfoClick: false,
      currentMap: "world",
      time: 0,
      countryMarkers: [],
      capitalMarkers: [],
    }

    WheelReact.config({
      left: () => {
        // console.log('wheel left detected.');
      },
      right: () => {
        // console.log('wheel right detected.');
      },
      up: () => {
        // console.log('wheel up detected.');
        this.handleZoom(0.5)
      },
      down: () => {
        // console.log('wheel down detected.');
        this.handleZoom(2)
      }
    });

    this.projection = this.projection.bind(this)
    this.handleZoom = this.handleZoom.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.handleCountryClick = handleCountryClick.bind(this)
    this.handleRegionSelect = this.handleRegionSelect.bind(this)
    this.handleQuiz = this.handleQuiz.bind(this)
    this.handleAnswer = handleAnswer.bind(this)
    this.handleQuizClose = this.handleQuizClose.bind(this)
    this.handleMapRefresh = this.handleMapRefresh.bind(this)
    this.handleDoubleClick = handleDoubleClick.bind(this)
    this.regionEllipses = regionEllipses.bind(this)
    this.countryLabels = countryLabels.bind(this)
    this.statusBar = statusBar.bind(this)
  }

  projection() {
    return geoTimes()
      .translate(this.state.dimensions.map(x => x/2))
      .scale(this.state.scale)
  }

  componentDidMount() {
    this.loadPaths()
  }

  componentWillUnmount () {
    WheelReact.clearTimeout();
  }

  loadPaths() {
    fetch("/world-50m.json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return;
        }
        response.json().then(worldData => {

          var data = feature(worldData, worldData.objects.countries).features;
          let countryMarkers = [];
          let capitalMarkers = [];

          // Remove Antarctica and invalid iso codes
          data = data.filter(x => +x.id !== 10 ? 1:0);

          var essentialData = ["name", "capital", "population", "area", "flag", "alpha3Code", "alpha2Code", "region"];

          DataFix(data, countryData, capitalMarkers)

          data.filter(x => (+x.id !== -99) ? 1:0).forEach(x => {
            let y = countryData.find(c => +c["numericCode"] === +x.id)

            essentialData.forEach(key => {
              x.properties[key] = y[key]
            })

            y["altSpellings"].shift()

            x.properties.spellings = [...new Set([y["name"],...y["altSpellings"], ...Object.values(y["translations"]).filter(x => x)])]

            let captemp = capitalData.find(x => x.CountryCode === y["alpha2Code"])
            if(captemp) {
              let capitalCoords = [+captemp.CapitalLongitude,+captemp.CapitalLatitude]
              
              capitalMarkers.push({name: y["capital"], alpha3Code: y["alpha3Code"], 
                coordinates:  capitalCoords,
                markerOffset: -7})
            }
          })

          SeparateRegions(data);

          data.forEach(x => {
            let alpha3Code = x.properties.alpha3Code
            let path = geoPath().projection(this.projection())
            countryMarkers.push([this.projection().invert(path.centroid(x)), alpha3Code])
          })

          countryMarkers = countryMarkers.map(array => ({ 
            name: data.find(x => x.properties.alpha3Code === array[1]).properties.name,
            alpha3Code: array[1], coordinates: array[0], markerOffset: 0}))
          MarkersFix(countryMarkers, capitalMarkers)

          this.setState({ geographyPaths: data, countryMarkers, capitalMarkers })
        })
      })
  }

  handleZoom(x) {
    this.setState({
      zoom: this.state.zoom * x,
    })
  }

  handleReset() {
    this.setState({
      center: [this.state.defaultCenter[0], this.state.defaultCenter[1] + Math.random()/1000],
      zoom: this.state.defaultZoom,
    })
  }

  handleMoveStart(currentCenter) {
    // console.log("Current center: ", currentCenter)
  }

  handleMoveEnd(newCenter) {
    // console.log("New center: ", newCenter)
  }

  handleRegionSelect(region) {
    let { center, zoom } = mapConfig[region];
    this.handleMapRefresh({
      zoom,
      defaultZoom: zoom,
      center,
      defaultCenter: center,
      currentMap: region,
      filterRegions: alpha3Codes[region],
      selectedProperties: "",
    })
  }

  handleQuiz(quizType){
    let quizAnswers = [...this.state.filterRegions]
    quizAnswers.reduce((dum1, dum2, i) => {
        const j = Math.floor(Math.random()*(quizAnswers.length - i) + i);
        [ quizAnswers[i], quizAnswers[j]] = [ quizAnswers[j], quizAnswers[i]];
        return quizAnswers
      }, quizAnswers)

    this.handleMapRefresh({
      quizAnswers,
      quizType,
      quiz: true,
      activeQuestionNum: 0,
      quizGuesses: [],
      selectedProperties: "",
      disableInfoClick: quizType.split("_")[0] === "type",
    })

    let x = Date.now()
    this.timer = setInterval(() => this.setState({ time: Date.now() - x }), 100)
  }

  handleQuizClose(){
    this.handleMapRefresh({
      quizAnswers: [],
      quizGuesses: [],
      quiz: false,
      quizType: null,
      activeQuestionNum: null,
      disableInfoClick: false,
      selectedProperties: "",
      time: 0,
    })
  }

  handleMapRefresh(args) {
    this.setState({ ...args, disableOptimization: true}
      , () => { this.setState({ disableOptimization: false }) } )
  }

  render() {

    if(this.state.quizGuesses.length === this.state.quizAnswers.length) {
      clearInterval(this.timer)
    }

    let { filterRegions, quiz, quizAnswers, quizGuesses,
      geographyPaths, activeQuestionNum, selectedProperties } = this.state

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Country Data</h1>
        </header>
        
        <div className="zoomButtons">
          <Button.Group size="tiny" basic vertical>
            <Button onClick={ () => this.handleZoom(2) } icon="plus" />
            <Button onClick={ () => this.handleZoom(.5) } icon="minus" />
            <Button onClick={ this.handleReset } icon="undo" />
          </Button.Group>
        </div>

        <QuizBox
          visible={ filterRegions.length !== 0 ? true:false }
          nonactive={ !quiz ? true:false }
          handleQuiz={ (quizType) => { this.handleQuiz(quizType) } }
          closequiz={ this.handleQuizClose}
          quizData = { {quizAnswers, quizGuesses, geographyPaths, activeQuestionNum} }
          handleAnswer={ this.handleAnswer }
        />

        <div className="dropDownSelections"
          style={ quiz ? {top: "-5em"}: null }
        >
          <CountrySearch
            projection={this.projection}
            state={this.state}
            mapRefresh={(arg) => {this.handleMapRefresh(arg)}}
          />
          <RegionButtons regionFunc={ this.handleRegionSelect } />
        </div>

        { this.statusBar() }

        <InfoTab country={selectedProperties}/>

        <div {...WheelReact.events}>
          <Map appthis={this} />
        </div>
        <footer><div>Copyright © 2018 Devang Patel. All rights reserved.</div></footer>
      </div>
    );
  }
}

export default App;
