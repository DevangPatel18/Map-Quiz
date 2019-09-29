import React, { Component } from 'react';
import InfoTabStyles from '../styles/InfoTabStyles';

class InfoTab extends Component {
  constructor(props) {
    super(props);
    this.state = { isFlagImgReady: false };
  }

  componentDidMount() {
    const flagImg = new Image();
    flagImg.src = this.props.regionData.flag;

    flagImg.onload = () => {
      this.setState({ isFlagImgReady: true });
    };
  }

  render() {
    if (!this.state.isFlagImgReady) return '';
    const { regionData } = this.props;
    let { name, capital, population, area, regionOf, flag } = regionData;
    population = population ? `${population.toLocaleString()}` : 'N/A';
    area = area ? `${area.toLocaleString()} km²` : 'N/A';
    return (
      <InfoTabStyles>
        <img className="infoTab-flag" src={flag} alt={`${name}-flag`} />
        <div className="infoTab-desc">
          <li>{name}</li>
          <li>Capital: {capital}</li>
          <li>Population: {population}</li>
          <li>Area: {area}</li>
          {regionOf ? <li>Region of {regionOf}</li> : ''}
        </div>
      </InfoTabStyles>
    );
  }
}

export default InfoTab;
