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

class App extends Component {
  constructor() {
    super()

    this.state = {
      center: [0,0],
      zoom: 1,
      geographyPaths: []
    }

    this.handleZoomIn = this.handleZoomIn.bind(this)
    this.handleZoomOut = this.handleZoomOut.bind(this)    
  }

  componentDidMount() {
    this.loadPaths()
  }

  loadPaths() {
    fetch("/world-50m.json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return;
        }
        response.json().then(worldData => {

          var isoUrl = 'https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json';

          fetch(isoUrl)
            .then(response => response.json())
            .then(cIso => {

              var data = feature(worldData, worldData.objects.countries).features;

              // Remove Antarctica
              data = data.filter(x => +x.id !== 10 ? 1:0)

              data.filter(x => (+x.id !== -99) ? 1:0).forEach(x => {
                let y = cIso.find(c => +c["country-code"] === +x.id)
                x.properties = {
                  name: y.name,
                  acronym: y['alpha-3'],
                  region: y.region,
                  'sub-region': y['sub-region'],
                  'intermediate-region': y['intermediate-region']
                }
              })

              this.setState({ geographyPaths: data })
            })
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

  handleMoveStart(currentCenter) {
    // console.log("Current center: ", currentCenter)
  }

  handleMoveEnd(newCenter) {
    // console.log("New center: ", newCenter)
  }

  handleCountryClick(countryIndex) {
    let x = this.state.geographyPaths[countryIndex].properties
    console.log(x);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Map quiz</h1>
        </header>

        <button onClick={ this.handleZoomIn }>{ "Zoom in" }</button>
        <button onClick={ this.handleZoomOut }>{ "Zoom out" }</button>

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
                <Geographies geography={ this.state.geographyPaths }>
                  {(geographies, projection) => 
                    geographies.map((geography, i) => (
                    <Geography
                      key={ `geography-${i}` }
                      cacheId={ `geography-${i}` }
                      geography={ geography }
                      projection={ projection }
                      onClick={() => this.handleCountryClick(i)}

                      fill="white"
                      stroke="black"
                      strokeWidth={ 0.1 }

                      style={{
                        default: { fill: "#FFF" },
                        hover:   { fill: "#F5F5F5" },
                        pressed: { fill: "#C0C0C0" },
                      }}
                    />
                  ))}
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          )}
        </Motion>
      </div>
    );
  }
}

export default App;
