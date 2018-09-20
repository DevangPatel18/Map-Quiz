import React, { Component } from 'react';
import './App.css';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker
} from "react-simple-maps"
import { feature } from "topojson-client"
import { Motion, spring } from "react-motion"
import WheelReact from 'wheel-react';
import countryData from "./assets/country_data.json"
import InfoTab from "./components/infoTab.js"
import { alpha3Codes, mapConfig } from "./assets/regionAlpha3Codes.js"
import RegionButtons from "./components/regionButtons.js"
import QuizBox from "./components/quizBox.js"
import ColorPicker from "./components/colorPicker.js"
import handleAnswer from "./components/handleAnswer.js"
import handleCountryClick from "./components/handleCountryClick.js"
import handleDoubleClick from "./components/handleDoubleClick.js"
import { Transition } from "react-transition-group"
import { geoPath } from "d3-geo"
import { geoTimes } from "d3-geo-projection"
import { DataFix, CentroidsFix } from "./helpers/attributeFix.js"
import capitalData from "./assets/country_capitals.json"
import { Button } from "semantic-ui-react"
import CountrySearch from "./components/countrySearch.js"
import oceaniaOutlines from "./components/oceaniaRegionOutlines.js"
import countryLabels from "./components/countryLabels.js"

// Arrays for label markers
let countryMarkers = [];
let capitalMarkers = [];

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
      infoDuration: 200,
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
      viewInfoDiv: false,
      currentMap: "world"
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
        this.handleZoomOut()
      },
      down: () => {
        // console.log('wheel down detected.');
        this.handleZoomIn()
      }
    });

    this.projection = this.projection.bind(this)
    this.handleZoomIn = this.handleZoomIn.bind(this)
    this.handleZoomOut = this.handleZoomOut.bind(this)    
    this.handleReset = this.handleReset.bind(this)
    this.handleCountryClick = handleCountryClick.bind(this)
    this.handleRegionSelect = this.handleRegionSelect.bind(this)
    this.handleQuiz = this.handleQuiz.bind(this)
    this.handleAnswer = handleAnswer.bind(this)
    this.handleQuizClose = this.handleQuizClose.bind(this)
    this.handleDisableInfoClick = this.handleDisableInfoClick.bind(this)
    this.handleMapRefresh = this.handleMapRefresh.bind(this)
    this.handleDoubleClick = handleDoubleClick.bind(this)
    this.oceaniaOutlines = oceaniaOutlines.bind(this)
    this.countryLabels = countryLabels.bind(this)
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

          // Remove Antarctica and invalid iso codes
          data = data.filter(x => +x.id !== 10 ? 1:0);

          var essentialData = ["name", "capital", "population", "area", "flag", "alpha3Code", "alpha2Code", "region"];
          
          // Remove Ashmore Reef to prevent extra Australia label
          data.splice(11, 1)

          // Set numericCode for Kosovo
          data[117].id = "999";
          DataFix(countryData, capitalMarkers)

          data.filter(x => (+x.id !== -99) ? 1:0).forEach(x => {
            let y = countryData.find(c => +c["numericCode"] === +x.id)

            essentialData.forEach(key => {
              x.properties[key] = y[key]
            })

            y["altSpellings"].shift()

            x.properties.spellings = [...new Set([y["name"],...y["altSpellings"], ...Object.values(y["translations"])])]

            let captemp = capitalData.find(x => x.CountryCode === y["alpha2Code"])
            if(captemp) {
              let capitalCoords = [+captemp.CapitalLongitude,+captemp.CapitalLatitude]
              
              capitalMarkers.push({name: y["capital"], alpha3Code: y["alpha3Code"], 
                coordinates:  capitalCoords,
                markerOffset: -7})
            }

            let path = geoPath().projection(this.projection())
            countryMarkers.push([this.projection().invert(path.centroid(x)), y["alpha3Code"]])
          })

          countryMarkers = countryMarkers.map(array => ({ 
            name: data.find(x => x.properties.alpha3Code === array[1]).properties.name,
            alpha3Code: array[1], coordinates: array[0], markerOffset: 0}))
          CentroidsFix(countryMarkers)

          this.setState({ geographyPaths: data })
        })
      })
  }

  handleZoomIn() {
    this.setState({
      zoom: this.state.zoom * 2,
    })
  }

  handleZoomOut() {
    this.setState({
      zoom: this.state.zoom / 2,
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
    let { center, zoom, defaultZoom } = mapConfig[region];
    this.handleMapRefresh({
      zoom,
      defaultZoom: zoom,
      center,
      defaultCenter: center,
      currentMap: region,
      filterRegions: alpha3Codes[region]
    })
  }

  handleQuiz(quizType){
    let quizAnswers = [...this.state.filterRegions]
    quizAnswers.reduce((dum1, dum2, i) => {
        const j = Math.floor(Math.random()*(quizAnswers.length - i) + i);
        [ quizAnswers[i], quizAnswers[j]] = [ quizAnswers[j], quizAnswers[i]];
        return quizAnswers
      }, quizAnswers)

    this.setState({quizAnswers, quizType, activeQuestionNum: 0, viewInfoDiv: false}
      ,() => { 

        setTimeout(() => {
          
          this.handleMapRefresh({ selectedProperties: "" }) 
        },  this.state.infoDuration)
      })
  }

  handleQuizClose(){
    this.setState({viewInfoDiv: false}, () => {
      setTimeout(() => {
        this.handleMapRefresh({
          quizAnswers: [],
          quizGuesses: [],
          quiz: false,
          quizType: null,
          activeQuestionNum: null,
          disableInfoClick: false,
          selectedProperties: "",
        })
      }, this.state.infoDuration)
    })
  }

  handleDisableInfoClick() {
    this.handleMapRefresh({ disableInfoClick: true })
  }

  handleMapRefresh(args) {
    this.setState({ ...args, disableOptimization: true}
      , () => { this.setState({ disableOptimization: false }) } )
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Country Data</h1>
        </header>
        
        <div className="zoomButtons">
          <Button.Group size="tiny" basic vertical>
            <Button onClick={ this.handleZoomIn } icon="plus" />
            <Button onClick={ this.handleZoomOut } icon="minus" />
            <Button onClick={ this.handleReset } icon="undo" />
          </Button.Group>
        </div>

        <QuizBox
          visible={ this.state.filterRegions.length !== 0 ? true:false }
          nonactive={ !this.state.quiz ? true:false }
          startquiz={ (quizType) => { this.setState({quiz: true}, this.handleQuiz(quizType)) } }
          closequiz={ this.handleQuizClose}
          quizAnswers={ this.state.quizAnswers }
          quizGuesses={ this.state.quizGuesses }
          geoPath={ this.state.geographyPaths }
          activeNum={ this.state.activeQuestionNum }
          answerResultFunc={ this.handleAnswer }
          disableInfoClick={ this.handleDisableInfoClick }
        />

        {!this.state.quiz ? <CountrySearch
          projection={this.projection}
          state={this.state}
          mapRefresh={(arg) => {this.handleMapRefresh(arg)}}
          countryMarkers={countryMarkers}
        />: ""}

        {!this.state.quiz ? <RegionButtons regionFunc={ this.handleRegionSelect } />: ""}

        <Transition in={this.state.viewInfoDiv} timeout={ this.state.infoDuration}>
          {(state) => {
            const defaultStyle = {
              transition: `opacity ${ this.state.infoDuration}ms ease-in-out`,
              opacity: 0,
            }

            const transitionStyles = {
              entering: { opacity: 0 },
              entered: { opacity: 1 },
            };

            return (
              <div style={{ ...defaultStyle, ...transitionStyles[state] }}>
                <InfoTab country={this.state.selectedProperties}/>
              </div>
          )}}
        </Transition> 

        <div {...WheelReact.events}>
          <Motion
            defaultStyle={{
              zoom: this.state.defaultZoom,
              x: this.state.center[0],
              y: this.state.center[1],
            }}
            style={{
              zoom: spring(this.state.zoom, {stiffness: 210, damping: 20}),
              x: spring(this.state.center[0], {stiffness: 210, damping: 20}),
              y: spring(this.state.center[1], {stiffness: 210, damping: 20}),
            }}
          >
            {({zoom,x,y}) => (
          
              <div
                ref={wrapper => this._wrapper = wrapper}
                // onDoubleClick={this.handleDoubleClick}
                >
              <ComposableMap
                projectionConfig={{ scale: this.state.scale, rotation: [-10,0,0] }}
                width={this.state.dimensions[0]}
                height={this.state.dimensions[1]}
                style={{
                  width: "100%",
                  height: "auto"
                }}
              >
                <ZoomableGroup
                  center={[x,y]}
                  zoom={zoom}
                  onMoveStart={this.handleMoveStart}
                  onMoveEnd={this.handleMoveEnd}
                >
                  <Geographies 
                    geography={ this.state.geographyPaths }
                    disableOptimization={this.state.disableOptimization}
                  >
                    {(geographies, projection) => 
                      geographies.map((geography, i) => {

                      let defaultColor, hoverColor, render;

                      [defaultColor, hoverColor, render] = ColorPicker(this.state, geography)

                      return render && (
                      <Geography
                        key={ `geography-${i}` }
                        cacheId={ `geography-${i}` }
                        geography={ geography }
                        projection={ projection }
                        onClick={this.handleCountryClick}

                        fill="white"
                        stroke="black"
                        strokeWidth={ 0.05 }

                        style={{
                          default: {
                            fill : defaultColor,
                            transition: "fill .5s",
                          },
                          hover:   {
                            fill : hoverColor,
                            transition: "fill .5s",
                          },
                          pressed: {
                            fill : "rgb(105, 105, 105)",
                            transition: "fill .5s"
                          },
                        }}
                      />
                      )}
                    )}
                  </Geographies>
                  <Markers>{ this.oceaniaOutlines(countryMarkers) }</Markers>
                  <Markers>{ this.countryLabels(countryMarkers,capitalMarkers) }</Markers>
                </ZoomableGroup>
              </ComposableMap>
              </div>
            )}
          </Motion>
        </div>
        <footer><div>Copyright © 2018 Devang Patel. All rights reserved.</div></footer>
      </div>
    );
  }
}

export default App;
