import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react'
import { geoPath } from "d3-geo"

export default class CountrySearch extends Component {
  render() {
    let countries = this.props.state.geographyPaths
    if(this.props.state.currentMap !== "world") {
      countries = countries.filter(x => this.props.state.filterRegions.includes(x.properties.alpha3Code))
    }

    countries = countries
      .map(x => {
        if(!x.properties.alpha2Code) {return null};
        let y = x.properties.alpha2Code.toString().toLowerCase()
        return { key: y, flag: y, text: x.properties.name, value: x.properties.alpha3Code}
      })
      .filter(x => x !== null)
      .filter(x => !['bl','cw','gg','im','je','mf','ss','sx'].includes(x.key))
      .sort((a,b) => a.text > b.text ? 1:-1)

    return (
      <div className="countrySearch">
        <Dropdown placeholder="Select Country" fluid search selection
          options={countries}
          onChange={(e,d) => {
            if(e.code === "Enter") {
              var selectedProperties = this.props.state.geographyPaths
                .find(x => x.properties.alpha3Code === d.value)
            } else {
              selectedProperties = this.props.state.geographyPaths
                .find(x => x.properties.name === e.target.innerText)
            }

            if(!selectedProperties) {return}

            let geography = selectedProperties
            selectedProperties = selectedProperties.properties;

            let center = this.props.state.countryMarkers
                .find(x => x.alpha3Code === selectedProperties.alpha3Code)
                .coordinates

            let path = geoPath().projection(this.props.projection())
            let bounds = path.bounds(geography)
            let width = bounds[1][0] - bounds[0][0];
            let height = bounds[1][1] - bounds[0][1];
            let zoom = 0.7 / Math.max(width / this.props.state.dimensions[0], height / this.props.state.dimensions[1]);

            zoom = selectedProperties.alpha3Code === "USA" ? zoom*6:zoom;
            
            zoom = Math.min(zoom, 64)

            this.props.mapRefresh({
              selectedProperties, center, zoom, viewInfoDiv: true
            })
            
          }}
        />
          
      </div>
    )
  }
}