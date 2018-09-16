import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react'
import "./countrySearch.css"

export default class CountrySearch extends Component {
  render() {
    let countries = this.props.state.geographyPaths
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
            let selected = e.target.innerText
            let selectedProperties = this.props.state.geographyPaths
              .find(x => x.properties.name === selected)

            if(!selectedProperties) {return}

            selectedProperties = selectedProperties.properties;

            let center = this.props.countryMarkers
                .find(x => x.alpha3Code === selectedProperties.alpha3Code)
                .coordinates

            let countryArea = selectedProperties.area;
            let kmPerPixel = Math.sqrt(countryArea)*2;
            let zoomEstimate = (40000000 / window.innerWidth ) / kmPerPixel;
            let zoom = Math.min(Math.pow(2, Math.floor(Math.log2(zoomEstimate))), 512)

            this.props.mapRefresh({
              selectedProperties, center, zoom, viewInfoDiv: true
            })
            
          }}
        />
          
      </div>
    )
  }
}