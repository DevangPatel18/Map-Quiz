import React, { Component } from 'react';
import './App.css';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps"
import { feature } from "topojson-client"
import { Motion, spring } from "react-motion"
import WheelReact from 'wheel-react';
import countryData from "./assets/country_data.json"
import InfoTab from "./components/infoTab.js"
import alpha3Codes from "./assets/regionAlpha3Codes.js"
import mapConfig from "./assets/regionMapConfig.js"
import RegionButtons from "./components/regionButtons.js"
import QuizBox from "./components/quizBox.js"
import ColorPicker from "./components/colorPicker.js"
import { Transition } from "react-transition-group"

// Duration for infoTab click
const infoDuration = 200;

class App extends Component {
  constructor() {
    super()

    this.state = {
      center: [0,0],
      zoom: 1,
      defaultZoom: 1,
      geographyPaths: [],
      selectedProperties: "",
      disableOptimization: false,
      filterRegions: [],
      quizAnswers: [],
      quizGuesses: [],
      quiz: false,
      activeQuestionNum: null,
      disableInfoClick: false,
      viewInfoDiv: false,
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

    this.handleZoomIn = this.handleZoomIn.bind(this)
    this.handleZoomOut = this.handleZoomOut.bind(this)    
    this.handleReset = this.handleReset.bind(this)
    this.handleCountryClick = this.handleCountryClick.bind(this)
    this.handleRegionSelect = this.handleRegionSelect.bind(this)
    this.handleQuiz = this.handleQuiz.bind(this)
    this.handleAnswer = this.handleAnswer.bind(this)
    this.handleQuizClose = this.handleQuizClose.bind(this)
    this.handleDisableInfoClick = this.handleDisableInfoClick.bind(this)
    this.handleMapRefresh = this.handleMapRefresh.bind(this)
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

          var essentialData = ["name", "capital", "population", "area", "flag", "alpha3Code"];

          data.filter(x => (+x.id !== -99) ? 1:0).forEach(x => {
            let y = countryData.find(c => +c["numericCode"] === +x.id)

            essentialData.forEach(key => {
              x.properties[key] = y[key]
            })

            y["altSpellings"].shift()

            x.properties.spellings = [...new Set([y["name"],...y["altSpellings"], ...Object.values(y["translations"])])]

          })

          // Additional spellings for countries
          data.find(x => x.properties.alpha3Code === "COG").properties.spellings.push("Republic of the Congo")
          data.find(x => x.properties.alpha3Code === "COD").properties.spellings.push("Democratic Republic of the Congo")
          data.find(x => x.properties.alpha3Code === "GBR").properties.spellings.push("Britain")
          data.find(x => x.properties.alpha3Code === "PRK").properties.spellings.push("North Korea")
          data.find(x => x.properties.alpha3Code === "KOR").properties.spellings.push("South Korea")
          data.find(x => x.properties.alpha3Code === "SYR").properties.spellings.push("Syria")

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
      center: [this.state.center[0], this.state.center[1] + Math.random()/1000],
      zoom: this.state.defaultZoom,
    })
  }

  handleMoveStart(currentCenter) {
    // console.log("Current center: ", currentCenter)
  }

  handleMoveEnd(newCenter) {
    // console.log("New center: ", newCenter)
  }

  handleCountryClick(geo) {
    if(!this.state.disableInfoClick) {
      if(this.state.activeQuestionNum === this.state.quizGuesses.length) {
        this.setState(prevState => {
          let quizGuesses = [...prevState.quizGuesses];
          quizGuesses.push(geo.properties["alpha3Code"]);
          return ({
            quizGuesses,
            disableOptimization: true,
            selectedProperties: geo.properties,
            viewInfoDiv: true
          })}, () => { this.setState({ disableOptimization: false }) }
        )
      } else {

        this.setState(prevState => ({
          disableOptimization: true,
          viewInfoDiv: !prevState.viewInfoDiv,
          }), () => {

            let selectedProperties = this.state.selectedProperties !== geo.properties ? geo.properties : "";
            let viewInfoDiv = selectedProperties !== "";

            setTimeout(() => {
              this.setState({
                disableOptimization: false,
                selectedProperties,
                viewInfoDiv
                }, this.handleMapRefresh)
              },infoDuration)
        })
      }
    }
  }

  handleRegionSelect(region) {
    let { center, zoom, defaultZoom } = mapConfig[region];
    this.setState({
      disableOptimization: true,
      zoom,
      defaultZoom,
      center,
      filterRegions: alpha3Codes[region]
    }, () => { this.setState({ disableOptimization: false }) })
  }

  handleQuiz(){
    let quizAnswers = [...this.state.filterRegions]
    quizAnswers.reduce((dum1, dum2, i) => {
        const j = Math.floor(Math.random()*(quizAnswers.length - i) + i);
        [ quizAnswers[i], quizAnswers[j]] = [ quizAnswers[j], quizAnswers[i]];
        return quizAnswers
      }, quizAnswers)

    this.setState({quizAnswers, activeQuestionNum: 0, viewInfoDiv: false}
      ,() => { 

        setTimeout(() => {
          this.setState({ selectedProperties: "" }, this.handleMapRefresh) 
        }, infoDuration)
      })
  }

  handleAnswer(userGuess = null, testing = null){
    let ans = this.state.quizGuesses;
    let cor = this.state.quizAnswers;
    let idx = this.state.activeQuestionNum;
    let text, nextButton;

    if(userGuess) {
      let correctAlpha = this.state.quizAnswers[this.state.activeQuestionNum]

      let answer, result;

      answer = this.state.geographyPaths
          .find(geo => geo.properties.alpha3Code === correctAlpha )
          .properties;
      
      if(testing === "name") {
        answer = answer.spellings;
        result = answer.some(name => userGuess.toLowerCase() === name.toLowerCase())
      } else {
        answer = answer.capital;
        result = userGuess.toLowerCase() === answer.toLowerCase()
      }

      text = `${userGuess} is ${result ? "correct!":"incorrect!"}`;

      this.setState(prevState => {
        let quizGuesses = [...prevState.quizGuesses];
        quizGuesses.push([userGuess, result]);
        return ({
          quizGuesses,
          disableOptimization: true,
        })}, () => { this.setState({ disableOptimization: false })
      })
    } else {
      text = ans[idx] === cor[idx] ? "that is correct!":"that is incorrect!";
    }

    if(idx === cor.length){
      var score = ans
        .reduce((total, x, i) => {
          if(x.length === 2) {
            return total += x[1] ? 1: 0;
          } else {
            return total += (x === cor[i])*1;
          }
        }, 0);
      var scoreText = <p>Your score is {score} / {cor.length} or {Math.round(score/cor.length*100)}%</p>
      text = "";
    } else {
      nextButton = <button 
        autoFocus
        onClick={ () => {
          this.setState( prevState => 
            ({
              viewInfoDiv: false,
              activeQuestionNum: prevState.activeQuestionNum + 1,
              disableOptimization: true
            })
            , () => { 
              setTimeout(() => {
                this.setState({ selectedProperties: ""}, this.handleMapRefresh) 
              }, infoDuration)
            }
          )
        }
      }>NEXT</button>;
    }

    return (
      <div>
        <p>{text}</p>
        {scoreText}
        {nextButton}
      </div>
    )
  }

  handleQuizClose(){
    this.setState({
      quizAnswers: [],
      quizGuesses: [],
      quiz: false,
      activeQuestionNum: null,
      disableOptimization: true,
      disableInfoClick: false,
    }, () => { this.setState({ disableOptimization: false }) } )
  }

  handleDisableInfoClick() {
    this.setState({ disableInfoClick: true }
      , this.handleMapRefresh )
  }

  handleMapRefresh() {
    this.setState({ disableOptimization: true}
      , () => { this.setState({ disableOptimization: false }) } )
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Country Data</h1>
        </header>
        
        <div style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)"
        }}>
          <button onClick={ this.handleZoomIn }>{ "Zoom in" }</button>
          <button onClick={ this.handleZoomOut }>{ "Zoom out" }</button>
          <button onClick={ this.handleReset }>{ "Reset view" }</button>
        </div>

        <QuizBox
          visible={ this.state.filterRegions.length !== 0 ? true:false }
          nonactive={ !this.state.quiz ? true:false }
          startquiz={ () => { this.setState({quiz: true}, this.handleQuiz) } }
          closequiz={ this.handleQuizClose}
          quizAnswers={ this.state.quizAnswers }
          quizGuesses={ this.state.quizGuesses }
          geoPath={ this.state.geographyPaths }
          activeNum={ this.state.activeQuestionNum }
          answerResultFunc={ this.handleAnswer }
          disableInfoClick={ this.handleDisableInfoClick }
        />        

        <RegionButtons regionFunc={ this.handleRegionSelect } />

        <Transition in={this.state.viewInfoDiv} timeout={infoDuration}>
          {(state) => {
            const defaultStyle = {
              transition: `opacity ${infoDuration}ms ease-in-out`,
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
              <ComposableMap
                projectionConfig={{ scale: 205, rotation: [-10,0,0] }}
                width={980}
                height={551}
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

                      console.log(geography);
                      
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
                </ZoomableGroup>
              </ComposableMap>
            )}
          </Motion>
        </div>
        <footer><div>Copyright © 2018 Devang Patel. All rights reserved.</div></footer>
      </div>
    );
  }
}

export default App;
