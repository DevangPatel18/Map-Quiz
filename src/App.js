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

class App extends Component {
  constructor() {
    super()

    this.state = {
      center: [0,0],
      zoom: 1,
      geographyPaths: [],
      selectedProperties: "",
      disableOptimization: false,
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

          var essentialData = ["name", "capital", "population", "area", "flag"];

          data.filter(x => (+x.id !== -99) ? 1:0).forEach(x => {
            let y = countryData.find(c => +c["numericCode"] === +x.id)

            essentialData.forEach(key => {
              x.properties[key] = y[key]
            })
          })

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
      center: [0,Math.random()/1000],
      zoom: 1,
    })
  }

  handleMoveStart(currentCenter) {
    // console.log("Current center: ", currentCenter)
  }

  handleMoveEnd(newCenter) {
    // console.log("New center: ", newCenter)
  }

  handleCountryClick(geo) {
    this.setState(prevState => ({
      disableOptimization: true,
      selectedProperties: prevState.selectedProperties !== geo.properties ? geo.properties : "",
      }), () => { this.setState({ disableOptimization: false }) }
    )
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Map quiz</h1>
        </header>

        <button onClick={ this.handleZoomIn }>{ "Zoom in" }</button>
        <button onClick={ this.handleZoomOut }>{ "Zoom out" }</button>
        <button onClick={ this.handleReset }>{ "Reset view" }</button>
        
        <InfoTab country={this.state.selectedProperties}/>

        <div {...WheelReact.events}>
          <Motion
            defaultStyle={{
              zoom: 1,
              x: 0,
              y: 0,
            }}
            style={{
              zoom: spring(this.state.zoom, {stiffness: 210, damping: 20}),
              x: spring(this.state.center[0], {stiffness: 210, damping: 20}),
              y: spring(this.state.center[1], {stiffness: 210, damping: 20}),
            }}
          >
            {({zoom,x,y}) => (
              <ComposableMap
                projectionConfig={{ scale: 205 }}
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
                      const isSelected = this.state.selectedProperties === geography.properties
                      return (
                      <Geography
                        key={ `geography-${i}` }
                        cacheId={ `geography-${i}` }
                        geography={ geography }
                        projection={ projection }
                        onClick={this.handleCountryClick}

                        fill="white"
                        stroke="black"
                        strokeWidth={ 0.1 }

                        style={{
                          default: { fill : isSelected ? "#F0F8FF" : "FFF"},
                          hover:   { fill : isSelected ? "#F0F8FF" : "#F5F5F5" },
                          pressed: { fill : "#C0C0C0" },
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
      </div>
    );
  }
}

export default App;
