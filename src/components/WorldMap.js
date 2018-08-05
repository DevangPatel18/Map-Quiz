import React, { Component } from "react"
import { geoMercator, geoPath } from "d3-geo"
import { feature } from "topojson-client"

class WorldMap extends Component {
  constructor() {
    super()
    this.state = {
      worldData: [],
      width: 0,
      height: 0
    }

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  projection() {
    return geoMercator()
      .scale(200)
      .translate([ 960 / 2, 500 / 2 ])
  }

  componentDidMount() {
    fetch("/world-50m.json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return;
        }
        response.json().then(worldData => {
          this.setState({
            worldData: feature(worldData, worldData.objects.countries).features,
          })
        })
      })

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({width: window.innerWidth, height: window.innerHeight });
  }
  
  render() {
    return (
      <svg
        width={ this.state.width }
        height={ this.state.width/2.2 }
        viewBox="0 -120 960 620"
      >
        <g className="countries">
          {
            this.state.worldData.map((d,i) => (
              <path
                key={ `path-${ i }` }
                d={ geoPath().projection(this.projection())(d) }
                className="country"
                fill="white"
                stroke="black"
                strokeWidth={ 0.3 }
              />
            ))
          }
        </g>
      </svg>
    )
  }
}

export default WorldMap;